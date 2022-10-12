import Annotation from "./base";
import { Comment } from "../../parse/interfaces";
import { ElementDescription } from "../interfaces";
import { ElementType as Element } from "../../../global/enums/elementType";

const PARAMETER_REGEX = /^\s*(?:{(.*)})?\s*(?:\$?([^\s[\]^]+))?\s*(?:\[([^\]]*)])?\s*(?:-?\s*([\S\s]*))?/;

export default class Parameter extends Annotation {
    name = "parameter";
    multiple = true;
    allowedOn = [Element.MIXIN, Element.FUNCTION];
    aliases = ["arg"];
    allowedInPoster = false;

    parse(line: string, comment: Comment): ElementDescription | undefined {
        const [, type, name, _default, description] = PARAMETER_REGEX.exec(line) ?? [];

        if (name === undefined) {
            this.logWarn(`Name is a required field but was not parsed. Location: ${comment.commentRange.start}:${comment.commentRange.end}`);
            return;
        }

        return {
            type,
            name,
            default: _default,
            description
        };
    }
}
