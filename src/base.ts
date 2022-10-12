import { CliUx, Command, Config, Flags } from "@oclif/core";
import { Arg, Input } from "@oclif/core/lib/interfaces";
import LogTransform from "./streams/log/log.stream";
import stdinReadable from "./streams/stdin/stdin.stream";

export default abstract class BaseCommand extends Command {
    protected globalFlags: { [name: string]: any } = {};
    protected flags: { [name: string]: any } = {};
    private args: { [name: string]: any } = {};
    protected readonly logger: LogTransform;
    protected stdin: string | undefined;

    constructor(argv: string[], config: Config) {
        super(argv, config);

        this.logger = new LogTransform({
            cliLogCb: (msg) => this.log(msg),
            cliLogSpinnerCb: (msg) => this.logSpinner(msg),
            cliErrorCb: (error) => this.error(error),
            cliWarnCb: (msg: string | Error) => this.warn(msg),
            filePath: "stylesdoc.log",
        });
    }

    static globalFlags = {};

    static flags = {
        silent: Flags.boolean({
            char: 's',            
            default: false,
            description: "Supress logs output except errors",
        }),
    };

    static args = [] as Arg[];

    log(msg: string, ...args: any[]): void {
        if (this.flags.silent) return;
        super.log(msg, ...args);
    }

    warn(msg: string | Error): string | Error {
        if (this.flags.silent) return msg;
        return super.warn(msg);
    }

    logSpinner = (msg?: string): void => {
        if (this.flags.silent) return;
        CliUx.ux.action.start(
            `\u001B[33m›\u001B[0m\u001B[33m›\u001B[0m\u001B[33m›\u001B[0m Running ${msg ?? ""}`
        );
    };

    public async init(): Promise<void> {
        const { args, flags } = await this.parse(
            this.constructor as Input<typeof BaseCommand.flags, typeof BaseCommand.globalFlags>
        );
        this.flags = flags;
        this.args = args;
        this.stdin = await stdinReadable();
    }
}
