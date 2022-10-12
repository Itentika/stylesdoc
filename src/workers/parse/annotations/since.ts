import Annotation from "./base";
import { Since as Model } from "../interfaces";

const SINCE_REGEX = /\s*(\S*)\s*(?:-?\s*([\S\s]*))?\s*$/;

export default class Since extends Annotation {
    name = "since";
    multiple = false;

    parse(line: string): Model {
        const [, version, description = ""] = SINCE_REGEX.exec(line) ?? [];

        return {
            version,
            description
        };
    }
}
