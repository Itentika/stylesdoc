import Annotation from "./base";
import { Example as Model } from "../interfaces";
import { trimSmart } from "../../../helpers/string.helper";

const LANGUAGE_REGEX = /(\w+)\s*-?\s*(.*)$/;

export default class Example extends Annotation {
    name = "example";
    allowedInPoster = false;

    parse(line: string): Model {

        const defaultExampleType = this.config.lang;

        let result = {
            type: defaultExampleType,
            code: line,
            description: ""
        }

        // Check if there is something on the first line and use it as the language information.        
        const optionalType = line.slice(0, line.indexOf('\n')).trim();
        if (optionalType.length > 0) {

            const langDesc = LANGUAGE_REGEX.exec(optionalType) ?? [];

            result = {
                type: langDesc[1] ?? defaultExampleType,
                description: langDesc[2],
                code: line.slice(optionalType.length + 1) // Remove type
            };
        }

        // Remove all leading/trailing line breaks.
        // Smart trim leading spaces
        result.code = result.code.replace(/^\n|\n$/g, '');
        result.code = trimSmart(result.code);
        return result;
    };
}
