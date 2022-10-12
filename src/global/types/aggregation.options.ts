import { OutputFormat } from "../enums/outputFormat";

export type AggregationOptions = {
    grouped: boolean;
    isSilent: boolean;
    outputFormat: OutputFormat;
    destinationPath?: string | undefined;
    sort: string[];
};
