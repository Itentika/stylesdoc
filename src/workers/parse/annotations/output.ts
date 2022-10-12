import { ElementType as Element } from "../../../global/enums/elementType";
import Annotation from "./base";

export default class Output extends Annotation {
    name = "output";
    multiple = true;
    aliases = ["outputs"];
    allowedOn = [Element.MIXIN];
    allowedInPoster = false;

    parse(line: string): { [name: string]: any } | string {
        return line.trim();
    }
}
