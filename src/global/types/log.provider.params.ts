import { PrettyPrintableError } from "@oclif/core/lib/errors";
import { MessageLogger } from "./message.logger";


export interface LogProviderParams {
    cliLogCb: (msg: string, ...args: any[]) => void;
    cliLogSpinnerCb: MessageLogger;
    cliErrorCb: (
        input: string | Error,
        options?: {
            code?: string | undefined;
            exit?: number | undefined;
        } & PrettyPrintableError
    ) => void;
    cliWarnCb: (msg: string | Error) => string | Error;
    filePath: string;
}
