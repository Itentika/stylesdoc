import path from "node:path";
import { existsSync, mkdirSync } from "node:fs";
import { JsonStreamResult } from "../parse/interfaces";
import { Writable, WritableOptions } from "node:stream";
import { FileHandle, open, writeFile } from "node:fs/promises";
import { MessageLogger } from "../../global/types/message.logger";

export default class JsonWritable extends Writable {
  private fd: FileHandle | undefined;
  private buffers: Buffer[] = [];

  constructor(
    private readonly destPath: string | undefined,
    private logger: MessageLogger,
    opts?: WritableOptions
  ) {
    super(opts);
  }

  async _construct(callback: (err?: Error) => void): Promise<void> {
    if (!this.destPath) {
      callback();
      return;
    }

    if (!ensureDirectoryExistence(this.destPath)) {
      callback(new Error(`Output path is not valid ${this.destPath}`));
      return;
    }

    try {
      this.fd = await open(this.destPath, "w");
      callback();
    } catch (error) {
      callback(error as Error);
    }
  }

  _write(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    if (this.destPath) {
      this.buffers.push(chunk);
    } else {
      console.log(JSON.stringify(JSON.parse(chunk.toString()), undefined, 2)); // stdout
    }

    callback();
  }

  async _final(
    callback: (error?: Error | null | undefined) => void
  ): Promise<void> {
    if (!this.destPath) {
      return;
    }

    const data = this.buffers.map((b) =>
      JSON.parse(b.toString())
    ) as JsonStreamResult;

    try {
      await writeFile(this.fd!, JSON.stringify(data.flat(1), undefined, 2));

      this.logger("JSON has been saved");
    } catch {
      callback(new Error("Cannot write into destination file"));
    }
  }

  async _destroy(
    error: Error | null,
    callback: (error?: Error | null | undefined) => void
  ): Promise<void> {
    if (error) {
      callback(error);
    } else if (this.fd) {
      try {
        await this.fd.close();
      } catch {
        callback(new Error("Cannot close file"));
      }
    }
  }
}

function ensureDirectoryExistence(filePath: string): boolean {
  const dirname = path.dirname(filePath);
  if (existsSync(dirname)) {
    return true;
  }

  // same name means we cannot find the subdirectory for directory
  if (dirname === filePath) {
    return false;
  }

  ensureDirectoryExistence(dirname);
  mkdirSync(dirname);
  return true;
}
