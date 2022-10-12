import path from "node:path";
import Piscina from "piscina";
import { Comment } from "../../workers/parse/interfaces";
import { Transform, TransformOptions } from "node:stream";
import { Settings } from "../../generators/settings";

export default class ParseTransform extends Transform {
    private pool: Piscina;

    constructor(
        private settings: Settings,
        props?: TransformOptions) {
        super(props);
        this.pool = new Piscina({
            filename: path.resolve(__dirname, "../../../dist/workers/parse/parse.js"), // eslint-disable-line unicorn/prefer-module
        });
    }

    _transform(
        path: Buffer,
        _encoding: string,
        callback: (error: Error | null, data: any) => void
    ): void {
        this.pool
            .run({ path: path.toString(), settings: this.settings })
            .then((comments: Comment[]) => {
                callback(null, Buffer.from(JSON.stringify(comments)));
            })
            .catch((error) => {
                callback(error, { data: path.toString(), comments: [] });
            });
    }

    async _final(
        callback: (error?: Error | null | undefined) => void
    ): Promise<void> {
        await this.pool.destroy();
        callback();
    }
}
