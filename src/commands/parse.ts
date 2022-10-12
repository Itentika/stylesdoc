import path from "node:path";
import BaseCommand from "../base";
import { Flags } from "@oclif/core";
import { pipeline } from "node:stream";
import NoopWritable from "../streams/noop/noop.stream";
import ParseTransform from "../streams/parse/parse.stream";
import { OutputFormat } from "../global/enums/outputFormat";
import loadSettings, { Settings } from "../generators/settings";
import TraverseReadable from "../streams/traverse/traverse.stream";
import AggregatorWritable from "../streams/parse/aggregator.stream";
import { buildWebsite, DefaultDataFilePath } from "../generators/hugo";
import { GenerationOptions } from "../global/types/generation.options";
import { AggregationOptions } from "../global/types/aggregation.options";

export const DefaultSettingsPath = path.join(process.cwd(), "settings.json");

export default class Parse extends BaseCommand {
    static description = "Parse style files.";
    static strict = false;
    static examples = [
        "<%= config.bin %> <%= command.id %> example_directory_path",
    ];

    static flags = {
        ...BaseCommand.flags,
        "to-json": Flags.boolean({
            description: "Parse input files into JSON format",
            exclusive: ["to-html", "to-md"],
            default: false,
        }),
        "to-html": Flags.boolean({
            description: "Parse input files into WEB format",
            exclusive: ["to-json", "to-md"],
            default: false,
        }),
        "to-md": Flags.boolean({
            description: "Parse input files into Markdown format",
            exclusive: ["to-json", "to-html"],
            default: false,
        }),
        config: Flags.file({
            char: "c",
            description: "Path to JSON configuration file",
            default: DefaultSettingsPath
        }),
        dest: Flags.string({
            char: "d",
            description: "Parsing destination (file path when saving JSON data, folder path when generating web site)"
        }),
        theme: Flags.string({
            char: "t",
            description: "Color theme for website",
            default: undefined
        }),       
        debug: Flags.boolean({
            description: "Display debug information",
            default: false,
            exclusive: ["silent"],
        }),
        grouped: Flags.boolean({
            description: "Group resulting items by group name and element type",
            default: undefined,
            dependsOn: ["to-json"]
        })
    };

    static args = [
        ...BaseCommand.args,
        { name: "paths", description: "paths to source directories" },
    ];

    public async run(): Promise<void> {
        let { flags, argv } = await this.parse(Parse); // eslint-disable-line prefer-const
        this.logger.isDebug = flags.debug;

        // By default - we are generating HTML website
        const outputFormat = this.parseOutputFormat(flags, OutputFormat.Html);
        if (outputFormat === OutputFormat.Markdown) {
            this.logger.warn("--to-md is not implemented yet");
            return;
        }

        // user didn't provide any paths to data
        if (argv.length === 0) {
            this.logger.log("Retrieveing paths from stdin...");
            if (this.stdin) {
                argv = this.stdin.replace(/[\n\r]+/g, "").split(" ");
                this.logger.log("stdin data " + argv);
            } else {
                this.logger.error("No paths found, please provide path(s) to style files.");
            }
        }
        
        // merge settings and flags (CLI flags should override settings.json)
        const settings = loadSettings(flags.config, this.logger.warn).updateFrom(this.flags);
        
        // if no destination provided, JSON is output to console,  
        // to prevent mixing log messages with JSON - turn on silent mode
        if (!settings.destination && outputFormat === OutputFormat.Json) {
            this.flags.silent = true;
        }

        this.logSpinner();

        // Set timer
        !this.flags.silent && console.time("Finished in");

        const aggregationOpts = this.buildAggregationOpts(outputFormat, settings, this.flags);
        const writable = aggregationOpts.outputFormat === OutputFormat.None
            ? new NoopWritable()
            : new AggregatorWritable(aggregationOpts, this.logger.logSuccess);

        // Run pipeline
        await new Promise<void>((resolve, reject) => {
            pipeline(
                new TraverseReadable(argv, settings.exclude, this.logger.logSuccess), // gather list of files
                this.logger.asPipe("---Files---", !flags.debug),
                new ParseTransform(settings), // parse each file in a separate thread
                this.logger.asPipe("---Data---", !flags.debug),
                writable, // accumulate results, post-process and save to a destination
                (error) => {
                    reject(error);
                    error && this.logger.error(error);
                }
            ).on("finish", () => {
                resolve();
                !this.flags.silent && console.timeEnd("Finished in");
            });
        });

        // Use JSON output, generated and saved by pipeline() above to a hardcoded path, to build website
        if (outputFormat === OutputFormat.Html) {
            const generationOpts = this.buildGenerationOpts(settings, flags);
            buildWebsite(generationOpts, this.logger.error, this.logger.logSuccess);
        }

        if (flags.debug) {
            this.logger.log("--Destination--");
            this.logger.log(path.resolve(settings.destination ?? "n/a"));
        }
    }

    private parseOutputFormat(flags: { [name: string]: any }, defaultValue: OutputFormat): OutputFormat {
        if (flags["to-json"] === true) return OutputFormat.Json;
        if (flags["to-html"] === true) return OutputFormat.Html;
        if (flags["to-md"] === true) return OutputFormat.Markdown;

        return defaultValue;
    }

    private buildGenerationOpts(settings: Settings, flags: { [name: string]: any }): GenerationOptions {
        return {
            silent: flags.silent,
            webSettings: settings.website,
            destination: settings.destination
        }
    }

    private buildAggregationOpts(outputFormat: OutputFormat, settings: Settings, flags: { [name: string]: any }): AggregationOptions {
        const opts: AggregationOptions = {
            grouped: flags.grouped,
            isSilent: flags.silent,
            outputFormat: outputFormat,
            destinationPath: settings.destination,
            sort: settings.sort
        }

        if (outputFormat === OutputFormat.Html) {
            opts.grouped = true;
            opts.outputFormat = OutputFormat.Json;
            opts.destinationPath = path.resolve(process.cwd(), DefaultDataFilePath); // when generating HTML - JSON is the intermediate step
        }

        return opts;
    }
}