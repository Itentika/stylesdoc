import Annotation from "./base";
import { Comment, AliasDescription } from "../interfaces";
import { ElementType as Element } from "../../../global/enums/elementType";

export default class Alias extends Annotation {
    name = "alias";
    multiple = false;
    allowedOn = [Element.FUNCTION, Element.MIXIN, Element.VARIABLE];
    allowedInPoster = false;
    resolvePriority = 110;

    parse(line: string): AliasDescription {
        return {
            name: line.trim()
        };
    };

    resolve(comments: Comment[]): Comment[] {
        for (const comment of comments) {
            if (comment.alias === undefined) {
                continue;
            }

            const { alias,
                context: { name: elementName = "", type: elementType },
                group: { name: elementGroupName } = { name: "" }
            } = comment;

            // Find 1st aliased comment by name - target of alias
            const aliasedComment = comments.find(x => x.context.name === alias.name);

            if (aliasedComment === undefined) {
                this.logWarn(`Element '${elementName}' is an alias of '${alias.name}' which does not exist.`);
                delete comment.alias;
                continue;
            }

            const { aliased, aliasedGroup,
                group: { name: aliasedElementGroup } = { name: "" },
                context: { type: aliasedElementType }
            } = aliasedComment;

            // Add reference that this element is aliased by other
            aliasedComment.aliased = [...(aliased || []), elementName];
            aliasedComment.aliasedGroup = [...(aliasedGroup || []),
            {
                name: elementName,
                type: elementType,
                group: elementGroupName
            }];

            // Update alias object of the current comment with info about target of alias
            comment.alias = {
                ...comment.alias, // eslint-disable-line unicorn/consistent-destructuring
                type: aliasedElementType,
                group: aliasedElementGroup
            };
        }

        return comments;
    }
}
