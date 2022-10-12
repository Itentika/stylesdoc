import { ElementType as Element } from "../../../global/enums/elementType";
import Annotation from "./base";

export default class Todo extends Annotation {
    name = "type";
    multiple = false;
    allowedOn = [Element.VARIABLE];
    allowedInPoster = false;

    parse(line: string): string {
        return line.trim();
    }
}
