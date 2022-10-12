import Annotation from "./base";
import { TypeDescription } from "../interfaces";
import { Comment } from "../../parse/interfaces";
import { ElementType as Element } from "../../../global/enums/elementType";

const RETURN_REGEX = /^\s*(?:{(.*)})?\s*(?:-?\s*([\S\s]*))?/;

export default class Return extends Annotation {
    name = "return";
    multiple = false;
    aliases = ["returns"];
    allowedOn = [Element.FUNCTION];
    allowedInPoster = false;

    parse(line: string, comment: Comment): TypeDescription | undefined {
        const [, type, description] = RETURN_REGEX.exec(line) ?? [];

        if (type === undefined) {
            this.logWarn(`Required 'type' field is missing. Location: ${comment.commentRange.start}:${comment.commentRange.end}`);
            return;
        }

        return {
            type,
            description
        };
    };
}
