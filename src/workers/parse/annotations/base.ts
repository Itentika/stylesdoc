import { Comment } from "../interfaces";
import Config from "../../../streams/parse/config";

export default abstract class Annotation {
    constructor(protected readonly config: Config) {
        this.default = this.default.bind(this);
        this.autofill = this.autofill.bind(this);
    }

    abstract name: string;
    abstract parse(
        text: string,
        comment: Comment,
        id: number
    ): { [name: string]: any } | string | boolean | void;

    default(_comment: Comment): { [name: string]: any } | string | undefined {
        return undefined;
    }

    autofill(_comment: Comment): { [name: string]: any }[] | { [name: string]: any } | string[] | string | undefined {
        return undefined;
    }

    multiple = true;
    overwritePoster?: boolean;
    allowedInPoster = true;
    allowedOn?: string[] = undefined;
    aliases: string[] = [];

    // Determines order of applying <annotation>.resolve in post-processing
    resolvePriority = 0;

    resolve(data: Comment[]): Comment[] {
        return data;
    }

    get alias(): { [name: string]: string } | undefined {
        if (this.aliases.length === 0) return;
        return Object.assign({}, ...this.aliases.map((x) => ({ [x]: this.name })));
    }

    /**
     * Indicates if autofill() was overriden in the current implementation of base Annotaion class.
     */
    get isAutofilled(): boolean {
        return Object.prototype.hasOwnProperty.call(this, "autofill");
    }
    
    get isAutofilAllowed(): boolean {
        return this.config.autofill && !this.config.disableAutofill.includes(this.name);
    }

    logWarn(message: string | Error): void {
        !this.config.isSilent &&
            console.warn("\u001B[36m%s\u001B[0m", `WRN @${this.name}: ${message.toString()}`);
    }
}
