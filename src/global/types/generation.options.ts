import { WebSiteSettings } from "./webSiteSettings";

export type GenerationOptions = {
    webSettings: WebSiteSettings,
    destination: string,
    silent: boolean
};
