import Annotation from "./base";
import { isVariable } from "../languageSpec";
import { trimQuotes } from "../../../helpers/parsing.helper";
import { Comment, ElementReference, RequireElement } from "../interfaces";
import { ElementType as Element } from "../../../global/enums/elementType";

export const DefaultElementType = "function";

const REQUIRE_REGEX = /^\s*(?:{(.*)})?\s*(?:(\$?\S+))?\s*(?:-?\s*([^$<]*))?\s*(?:<?\s*(.*)\s*>)?$/;
const IS_FROM_EXTERNAL_SOURCE = /^[^#].*(::|:|\.|,|\/)+.*/; // LESS uses # as namespace prefix - exclude it

function buildRequireElement(type: string) {
    return function (name: string): RequireElement {
        return { type, name, external: false, autofilled: true }
    }
}

function getUniqueMatches(
    codeSnippet: string,
    regex: RegExp,
    isPresentInAnnotationFn: (match: string) => boolean,
    matchGroupId = 1): string[] {

    let match: RegExpExecArray | null;
    const matches = new Set<string>(); // keeps only unique items

    while ((match = regex.exec(codeSnippet))) {
        if (isPresentInAnnotationFn(match[matchGroupId])) {
            continue;
        }

        if ((matchGroupId <= 1 || match[matchGroupId - 1] === undefined)) {
            matches.add(match[matchGroupId])
        }
    }

    return [...matches];
}

type DocumentedItem = { name: string, type: string };
function isInDocumentedItems(documentedItems: DocumentedItem[] = [], type = "", name = "") {
    return documentedItems.findIndex(x => x.name === name && x.type === type) >= 0;
}

export default class Require extends Annotation {
    name = "require";
    aliases = ["requires"];
    allowedOn = [Element.MIXIN, Element.FUNCTION, Element.PLACEHOLDER, Element.VARIABLE, Element.USE, Element.FORWARD];
    allowedInPoster = false;
    resolvePriority = 110;

    parse(line: string): RequireElement {
        const [, type = DefaultElementType, name, description, url] = REQUIRE_REGEX.exec(line.trim()) ?? [];
        const result = {
            type,
            name,
            url: trimQuotes(url),
            autofilled: false,
            description: description?.trim(),
            external: IS_FROM_EXTERNAL_SOURCE.test(name)
        };

        if (isVariable(result.name, this.config.isLess)) {
            result.type = Element.VARIABLE;
            result.name = result.name.slice(1);
        }

        if (result.name.indexOf('%') === 0) {
            result.type = Element.PLACEHOLDER;
            result.name = result.name.slice(1);
        }

        return result;
    };

    autofill(item: Comment): RequireElement[] | undefined {
        const type = item.context.type;
        if (!["mixin", "placeholder", "function"].includes(type)) {
            return;
        }

        // Build a lookup list of items documented in annotation
        const documentedItems: DocumentedItem[] = [];
        for (const { name, type } of item.require ?? []) {
            documentedItems.push({ name, type });
        }

        const mixins = getUniqueMatches(
            item.context.snippet ?? "",
            /@include\s+([^$(;]*)/gi,
            isInDocumentedItems.bind(null, documentedItems, "mixin")
        )
            .map(buildRequireElement("mixin"));

        // used Regex becaus eliteral destroys syntax
        const functions = getUniqueMatches(
            item.context.snippet ?? "",
            new RegExp('(@include)?\\s*([a-z0-9_-]+)\\s*\\(', 'ig'), // eslint-disable-line prefer-regex-literals 
            isInDocumentedItems.bind(null, documentedItems, "function"),
            2 // Get the second matching group instead of 1
        )
            .map(buildRequireElement("function"));

        const placeholders = getUniqueMatches(
            item.context.snippet ?? "",
            /@extend\s*%([^\s;]+)/gi,
            isInDocumentedItems.bind(null, documentedItems, "placeholder")
        )
            .map(buildRequireElement("placeholder"));

        const variables = getUniqueMatches(
            item.context.snippet ?? "",
            /\$([\w-]+)/gi,
            isInDocumentedItems.bind(null, documentedItems, "variable")
        )
            .map(buildRequireElement("variable"));

        // Merge autofilled @require items of all types
        let all = [...mixins, ...functions, ...variables, ...placeholders];

        // Merge in @require items documented in annotation
        all = [...all, ...(item.require ?? [])];

        // Filter out empty values and the current item.
        all = all
            .filter(x => x !== undefined)
            .filter(x => !(x.name === item.context.name && x.type === item.context.type));

        return all.length > 0 ? all : undefined;
    };

    resolve(comments: Comment[]): Comment[] {
        for (const comment of comments) {
            if (comment.require === undefined) {
                continue;
            }

            // Update usedBy of referenced comments
            comment.require = comment.require
                .flatMap((req: RequireElement) => {
                    if (req.external) {
                        return req;
                    }

                    // Find iten which is referenced by current @require annotation
                    const referencedComment = comments.find(x => x.context.name === req.name && x.context.type === req.type);

                    if (referencedComment === undefined) {
                        if (!req.autofilled) {
                            this.logWarn(`Item '${comment.context.name}' requires '${req.name}' which does not exist.`);
                        }

                        return [];
                    }

                    const reference: ElementReference = {
                        context: comment.context,
                        description: comment.description,
                        group: comment.group?.name
                    };
                    req.group = referencedComment.group?.name;

                    referencedComment.usedBy = referencedComment.usedBy || [];
                    referencedComment.usedBy.push(reference);

                    return req;
                })
                .filter((x: RequireElement) => x !== undefined); // map

            // CLean up properties
            comment.require = (<RequireElement[]>comment.require)?.map(x => {
                delete x.autofilled;
                if (x.external) {
                    delete x.context;
                }
                else {
                    delete x.url;
                }

                return x;
            })
        } // for..of

        return comments;
    }
}
