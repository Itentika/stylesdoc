import Annotation from "./base";
import { Comment } from "../interfaces";
import { AccessType } from "../../../global/enums/acessType";

const PRIVATE_PREFIX_REGEX = /^[_-]/;

const DefaultAccess = AccessType.public;

export default class Access extends Annotation {
    name = "access";
    multiple = false;

    default = (): string => {
        return this.isAutofilAllowed ? "auto" : DefaultAccess;
    }

    parse = (line: string): { [name: string]: any } | string => {
        const value = line.trim().toLowerCase();

        if (value in AccessType) {
            return value;
        }

        return this.default();
    };

    autofill (item: Comment): string | undefined {
        // Autofill works if access was not set in parse()
        if (item.access?.toString() !== "auto") {
            return;
        }

        const privatePrefix = this.config.privatePrefix ?? true;
        if (privatePrefix === false) {
            return DefaultAccess; // default
        }

        const isPrivateRegex = typeof privatePrefix === "string" ? new RegExp(privatePrefix) : PRIVATE_PREFIX_REGEX;

        return item.context.name && isPrivateRegex.test(item.context.name)
            ? AccessType.private
            : AccessType.public;
    };
}
