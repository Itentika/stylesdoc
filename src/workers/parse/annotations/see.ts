import Annotation from "./base";
import { isVariable } from "../languageSpec";
import { Comment, ElementReference, SeeElementType } from "../interfaces";
import { ElementType as Element } from "../../../global/enums/elementType";

const SEE_REGEX = /\s*(?:{([\w-_]+)}\s*)?(.*)/;

export const DefaultSeeElementType = "function";

const isSeeElementType = (x: any): x is SeeElementType => x.type !== undefined;

export default class See extends Annotation {
    name = "see";
    allowedOn = [Element.MIXIN, Element.FUNCTION, Element.PLACEHOLDER, Element.VARIABLE, Element.USE, Element.FORWARD];
    allowedInPoster = false;    

    parse(line: string): SeeElementType {
        const [, type = DefaultSeeElementType, name] = SEE_REGEX.exec(line) ?? [];

        const result = {
            type,
            name
        };

        if (isVariable(result.name, this.config.isLess)) {
            result.type = "variable";
            result.name = result.name.slice(1);
        }

        if (result.name.indexOf('%') === 0) {
            result.type = "placeholder";
            result.name = result.name.slice(1);
        }

        return result;
    };

    resolve(comments: Comment[]): Comment[] {
        for (const comment of comments) {
            if (comment.see === undefined) continue;

            // Find comments, mentioned in "see", by name
            const referencedComments = (<SeeElementType[]>comment.see).map(see => {
                if (!isSeeElementType(see)) return;

                // Check "name" field as well to deal with possible renaming of the element using @name annotation
                const referencedComment = comments.find(x => see.name === x.context.name || see.name === x.name);
                if (referencedComment === undefined) {
                    this.logWarn(`Item '${comment.context.name}' refers to '${see.name}' which does not exist.`);
                    return;
                }

                return referencedComment;
            });

            comment.see = referencedComments.filter(x => x !== undefined)
                .map(x => ({
                    context: x!.context,
                    description: x!.description,
                    group: x!.group?.name
                } as ElementReference));
        }

        return comments;
    }
}
