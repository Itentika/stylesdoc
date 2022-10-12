import os from "node:os";
import { Transform, TransformOptions } from "node:stream";
import { PrettyPrintableError } from "@oclif/core/lib/errors";
import { FileHandle, open, writeFile } from "node:fs/promises";
import { LogProviderParams } from "../../global/types/log.provider.params";

export default class LogTransform extends Transform {
  private fd: FileHandle | undefined;
  private pipeBlockTitle: string | undefined;
  private isNoopPipe = false;
  private initialMsgApplied = false;

  public isDebug = false;

  constructor(
    private logProviderParams: LogProviderParams,
    props?: TransformOptions
  ) {
    super(props);
  }

  setBlockTitle(title: string): void {
    this.pipeBlockTitle = title;
  }

  asPipe(blockTitle: string, isNoop = false): LogTransform { 
    const newPipe = new LogTransform(this.logProviderParams);
    newPipe.setBlockTitle(blockTitle);
    newPipe.isNoopPipe = isNoop;
    return newPipe;
  }

  log = async (msg: string): Promise<void> => {
    this.isDebug && (await this.appendDataInFile("LOG", msg));
    this.logProviderParams.cliLogCb(msg);
  };

  logSuccess = async (msg: string): Promise<void> => {
    if (this.isDebug) return;
    this.isDebug && (await this.appendDataInFile("LOG", msg));
    this.logProviderParams.cliLogCb("\u001B[32m✔\u001B[0m " + msg);
  };

  logSpinner = (msg: string): void => {
    this.logProviderParams.cliLogSpinnerCb(msg);
  };

  warn = async (msg: string | Error): Promise<string | Error> => {
    this.isDebug && (await this.appendDataInFile("WRN", msg.toString()));
    return this.logProviderParams.cliWarnCb(msg);
  };

  error = async (
    input: string | Error,
    options?: {
      code?: string | undefined;
      exit?: number | undefined;
    } & PrettyPrintableError
  ): Promise<void> => {
    this.isDebug && (await this.appendDataInFile("ERR", input.toString()));
    this.logProviderParams.cliErrorCb(input, options);
  };

  private async appendDataInFile(type: "ERR" | "WRN" | "LOG", msg: string) {
    return writeFile(
      this.logProviderParams.filePath,
      `${this.dateTime} ${type} ${msg} ${os.EOL}`,
      {
        flag: "a+",
      }
    );
  }

  async _construct(callback: (err?: Error) => void): Promise<void> {
    if (this.isNoopPipe) {
      callback();
      return;
    }

    try {
      this.fd = await open(this.logProviderParams.filePath!, "a+");
      callback();
    } catch (error){
        this.logProviderParams.cliWarnCb(`Failed to open log file. ${error}`);
        // callback(error as Error);
    }
  }

  async _transform(
    data: Buffer,
    _encoding: string,
    callback: (error: Error | null, data?: any) => void
  ): Promise<void> {
    if (this.isNoopPipe) {
      callback(null, data);
      return;
    }

    if (this.pipeBlockTitle && !this.initialMsgApplied) {
      this.logProviderParams.cliLogCb?.(this.pipeBlockTitle);

      try {
        await writeFile(this.fd!,`${this.dateTime} ${this.pipeBlockTitle} ${os.EOL}`);
      } catch {
        callback(new Error("Cannot write into log file"));
      }

      this.initialMsgApplied = true;
    }

    try {
      await writeFile(this.fd!, data);
      await writeFile(this.fd!, os.EOL);
    } catch {
      callback(new Error("Cannot write into log file"));
    }

    this.logProviderParams.cliLogCb?.(data.toString());
    callback(null, data);
  }

  async _final(
    callback: (error?: Error | null | undefined) => void
  ): Promise<void> {
    try {
      await this.fd?.close();
      callback();
    } catch (error) {
      callback(error as Error);
    }
  }

  get dateTime(): string {
    const date = new Date();
    return date.toISOString();
  }
}
