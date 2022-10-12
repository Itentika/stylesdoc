import { Settings } from "../../generators/settings";
import { AccessType } from "../../global/enums/acessType";
import { getFileExtension } from "../../helpers/string.helper";

export const DefaultGroup = "general";

export default class Config {
    readonly isSilent: boolean = false;
    readonly isLess: boolean = false;
    readonly lang: string = "";

    autofill: boolean;
    disableAutofill: string[] = [];
    displayAccess: AccessType[];
    privatePrefix?: boolean | string | undefined;
    groups: Record<string, string> = { undefined: DefaultGroup }; // group : human-readable desc

    get defaultGroup(): string {
        return this.groups.undefined;
    }

    constructor({ settings, isSilent, path: fileName }: { settings?: Settings; isSilent?: boolean; path?: string } = {}) {

        settings = settings ?? new Settings();
        
        this.autofill = settings.autofill;
        this.privatePrefix = settings.privatePrefix;
        this.displayAccess = settings.displayAccess ?? [];
        this.disableAutofill = (settings.disableAutofill ?? []).map(x => x.toLowerCase());
        
        this.isSilent = isSilent ?? this.isSilent;
        if (fileName) {
            this.lang = getFileExtension(fileName).toLowerCase();
            this.isLess = this.lang === "less";
        }

        this.groups = {
            ... this.groups,
            ... this.copyAndLowercase(settings.groups ?? {})
        }
    }

    tryReplaceGroup(group: string): string {
        const loweredGroupName = (group?.trim() ?? "").toLowerCase();

        return loweredGroupName.length > 0
            ? (this.groups[loweredGroupName] ?? loweredGroupName)
            : this.defaultGroup; // when no group passed in 
    }

    private copyAndLowercase(source: Record<string, string>): Record<string, string> {
        const result: Record<string, string> = {};

        for (const key of Object.keys(source)) {
            result[key.toLowerCase()] = source[key];
        }

        return result;
    }
}
