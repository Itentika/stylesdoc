import { Writable } from "node:stream";

export default class NoopWritable extends Writable {
  _write(
    _chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void
  ): void {
    callback();
  }
}
