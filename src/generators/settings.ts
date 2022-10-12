import fs from "node:fs";
import { AccessType } from "../global/enums/acessType";
import { ColorScheme } from "../global/enums/colorScheme"
import { MessageLogger } from "../global/types/message.logger";
import { ParserSettings } from "../global/types/parser.settings";
import { parseAccessType, parseColorScheme } from "../helpers/enum.helper";

/**
 * Loads settings from ./settings.json (by default). If file path is passed in, tries to resolve and load using the provided path. 
 * @param {string} settingsFilePath Optional path to custom config file
 * @param {Function} logWarning Logger-function for logging warnings
 * @returns {Settings} Settings object
 */
export default (settingsFilePath: string, logWarning?: MessageLogger | undefined): Settings => {

    if (!fs.existsSync(settingsFilePath)) {
        logWarning && logWarning(`Configuration file ${settingsFilePath} was not found. Default settings will be used.`);
        return new Settings();
    }

    return new Settings(fs.readFileSync(settingsFilePath, 'utf-8'));
}

export class Settings implements ParserSettings {
    website = {
        watermark: true,
        watermarkText: "Developed by ITentika",
        colorScheme: ColorScheme.Light,
        displayAlias: false,
        basePath: ""
    }

    destination = "./web/public";
    autofill = true;
    sort: string[] = [];
    exclude: string[] = [];
    disableAutofill: string[] = [];
    privatePrefix: boolean | string | undefined = undefined;
    displayAccess: AccessType[] = [AccessType.public, AccessType.private];
    groups: Record<string, string> = {};

    constructor(json = "{}") {
        const input: ParserSettings = JSON.parse(json);

        // Merge JSON and default values
        const obj = {
            ...this, ...input,
            website: {
                ...this.website, ...input.website
            }
        };
        Object.assign(this, obj);

        // Sanitize
        this.displayAccess = this.displayAccess
            .map(x => parseAccessType(x))
            .filter(x => x !== undefined) as AccessType[];
    }

    updateFrom(flags: { [name: string]: any }): Settings {
        if (typeof flags.dest === "string") {
            this.destination = flags.dest;
        }

        const colorScheme = parseColorScheme(flags.theme);
        if (colorScheme !== undefined) {
            this.website.colorScheme = colorScheme;
        }

        return this;
    }
}