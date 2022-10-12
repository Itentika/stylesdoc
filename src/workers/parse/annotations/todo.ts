import Annotation from "./base";

export default class Todo extends Annotation {
    name = "todo";
    aliases = ["todos"];

    parse(line: string): string {
        return line.trim();
    }
}
