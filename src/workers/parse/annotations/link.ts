import Annotation from "./base";
import { Link as Model } from "../interfaces";
import { trimQuotes } from "../../../helpers/parsing.helper";
import { ElementType as Element } from "../../../global/enums/elementType";

const LINK_REGEX = /\s*([^:]+:\/\/\S*)?\s*(.*?)$/;

export default class Link extends Annotation {
    name = "link";
    aliases = ["source"];
    allowedOn = [Element.MIXIN, Element.FUNCTION, Element.PLACEHOLDER, Element.VARIABLE, Element.USE, Element.FORWARD];

    parse(text: string): Model {
        const [, url = "", caption = ""] = LINK_REGEX.exec(text.trim()) ?? [];

        return {
            url: trimQuotes(url),
            caption
        };
    }
}
