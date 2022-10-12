import { ColorScheme } from "../enums/colorScheme";

export type WebSiteSettings = {
    watermark: boolean;
    watermarkText: string;
    colorScheme: ColorScheme;
    displayAlias: boolean;
    webAnalyticType?: string;
    webAnalyticKey?: string;
    trackingCode?: string;
    shortcutIcon?: string;
    basePath?: string;    
};
