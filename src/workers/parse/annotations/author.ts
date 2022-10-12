import Annotation from "./base";

export default class Author extends Annotation {
    name = "author";

    parse(line: string): { [name: string]: any } | string {
        return line.trim();
    }
}
