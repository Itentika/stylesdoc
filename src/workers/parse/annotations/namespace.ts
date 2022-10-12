import Annotation from "./base";
import { Comment } from "../interfaces";
import SCSS_REGEX from "../helpers/scss.regex";
import { ElementType as Element } from "../../../global/enums/elementType";

export default class Namespace extends Annotation {
    name = "namespace";
    multiple = false;
    allowedOn = [Element.USE, Element.FORWARD];
    allowedInPoster = false;

    parse(line: string, comment: Comment): string | undefined {
        let nameSpace = comment.context.name;
        if (comment.context.name === "Unnamed") {
            const match = SCSS_REGEX.FILE_AS_NAMESPACE.exec(comment.context.params?.quoteData?.trim() ?? "");
            nameSpace = match?.groups?.file;
        }

        return nameSpace;
    }
}
