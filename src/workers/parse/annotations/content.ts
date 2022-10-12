import Annotation from "./base";
import { Comment } from "../interfaces";
import { ElementType as Element } from "../../../global/enums/elementType";

export const DefaultContentText = "This mixin accepts content block";

export default class Content extends Annotation {
    name = "content";
    allowedOn = [Element.MIXIN];
    multiple = false;
    allowedInPoster = false;

    parse(line: string): { [name: string]: any } | string {
        return line.trim();
    };

    autofill(item: Comment): string | undefined {
        if (!item.content && (item.context.snippet ?? '').includes('@content')) {
            return DefaultContentText;
        }
    };
}
