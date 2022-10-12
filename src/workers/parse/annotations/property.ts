import Annotation from "./base";
import { ElementDescription } from "../interfaces";
import { ElementType as Element } from "../../../global/enums/elementType";

const PROPERTY_REGEX = /\s*(?:{(.*)})?\s*(?:(\$?\S+))?\s*(?:\[([^\]]*)])?\s*-?\s*([\S\s]*)\s*$/;

export const DefaultPropertyType = "Map";

export default class Property extends Annotation {
    name = "property";
    allowedOn = [Element.VARIABLE];
    aliases = ["prop"];
    allowedInPoster = false;

    parse(line: string): ElementDescription | string {
        const [, type = DefaultPropertyType, name, _default, description] = PROPERTY_REGEX.exec(line.trim()) || [];

        return {
            type,
            name,
            default: _default,
            description
        };
    }
}
