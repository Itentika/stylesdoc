import Annotation from "./base";

/**
 * Parsing of deprecated annotation
 */
export default class Deprecated extends Annotation {
    name = "deprecated";
    multiple = false;

    parse(line: string): { [name: string]: any } | string {
        return line.trim();
    }
}
