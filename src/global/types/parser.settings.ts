import { AccessType } from "../enums/acessType";
import { WebSiteSettings } from "./webSiteSettings";

export type ParserSettings = {
    autofill:boolean;
    disableAutofill: string[];
    sort: string[];
    exclude: string[]
    displayAccess: AccessType[];
    groups: Record<string, string>; 
    privatePrefix: boolean | string | undefined;
    destination: string | undefined;
    
    website: WebSiteSettings;
};


