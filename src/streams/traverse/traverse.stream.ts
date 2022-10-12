import globby, { Entry } from "globby";
import { Readable } from "node:stream";
import { MessageLogger } from "../../global/types/message.logger";

export type Errors = {
    warnings: string[];
    errors: string[];
};

const CSS_STYLE_REGEX = /^.+(scss|sass|less)$/g;

export default class TraverseReadable extends Readable {
    private index = 0;
    private readonly iterableDataPromise: Promise<Entry[]>;

    constructor(
        private pathArgs: string[],
        private exludePath: string[] = [],
        private logger: MessageLogger | undefined
    ) {
        super();
        this.iterableDataPromise = this.getPaths();
    }

    private async getPaths() {
        const paths = [...new Set(this.pathArgs)];
        
        return globby(
            paths.map((p) => p.replace(/\\/g, "/")),
            {
                onlyFiles: true,
                expandDirectories: {
                    // doesn't work when glob is path to the file
                    extensions: ["sass", "scss", "less"],
                },
                ignore: this.exludePath,
                stats: true,
            }
        ) as unknown as Promise<Entry[]>;
    }

    _read(): void {
        this.iterableDataPromise
            .then((stats) => {
                const data = stats
                    .filter((x) => x.name.match(CSS_STYLE_REGEX))
                    .map((x) => x.path);

                if (data.length === 0) {
                    this.destroy(
                        new Error("No files found with the following extensions .scss .less .sass"));
                }

                let pushResult = true;
                while (pushResult && this.index < data.length) {
                    pushResult = this.push(data[this.index]);
                    this.index++;
                }

                if (data.length > 0 && this.index >= data.length) {
                    this.logger && this.logger("List of files has been prepared");
                    this.push(null);
                }
            })
            .catch((error) => {
                this.destroy(error);
            });
    }

    _destroy(
        error: Error | null,
        callback: (error?: Error | null | undefined) => void
    ): void {
        if (error) {
            callback(error);
        }
    }
}
