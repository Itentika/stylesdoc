import Annotation from "./base";
import { Comment } from "../interfaces";
import { ElementType as Element } from "../../../global/enums/elementType";

const ERROR_REGEX = /@error\s+["']([^"']+)/g;

export default class Throw extends Annotation {
    name = "throw";
    aliases = ["throws", "exception"];    
    allowedOn = [Element.MIXIN, Element.FUNCTION, Element.PLACEHOLDER];
    allowedInPoster = false;

    parse(line: string): string {
        return line.trim();
    }

    autofill(item: Comment): string[] | undefined {
        const throwing = new Set<string>(item.throw); // keeps only unique items
        
        let match;
        while ((match = ERROR_REGEX.exec(item.context.snippet ?? "")) !== null) {
            throwing.add(match[1]);
        }

        if (throwing.size > 0) {
            return [...throwing];
        }
    }
}
