import Annotation from "./base";

export default class Ignore extends Annotation {
    name = "ignore";
    multiple = false;

    parse(): void {}
}
