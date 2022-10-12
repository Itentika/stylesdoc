import path from "node:path";
import { ensureFolder } from "../helpers/io.helper";
import { pushTo } from "../helpers/dictionary.helper";
import { spawn, SpawnOptions } from "node:child_process";
import { MessageLogger } from "../global/types/message.logger";
import { GenerationOptions } from "../global/types/generation.options";

const Theme = "itentika";
const WebFolderPath = "web";
const HugoPath = path.join('node_modules', '.bin', 'hugo', 'hugo');

export const DefaultDataFilePath = path.join(WebFolderPath, "themes", Theme, "data", "data.json");

/**
 * Runs HUGO binary from node_modules to generate web-site using JSON data file. 
 * JSON data file is expected to be saved as "groups.json" in .\web\themes\<theme_name>\data
 * @param {GenerationOptions} generationOpts Options thaty regulate generation process
 * @param {Function} logError Logger-function for logging errors
 * @param {Function} logSuccess Logger-function for logging success completion
 * @returns void
 */
export function buildWebsite(
    generationOpts: GenerationOptions,
    logError: MessageLogger | undefined,
    logSuccess?: MessageLogger | undefined): void {

    const opts: SpawnOptions = {
        stdio: generationOpts.silent ? "ignore" : "inherit",
        cwd: process.cwd()
    };
    const args = ["-s", `./${WebFolderPath}`,
        "--cleanDestinationDir",
        "--gc",
        "--minify",
        "--config=config/production/config.yaml"
    ];

    if (generationOpts.destination) {
        const destFolder = path.resolve(
            ensureFolder(generationOpts.destination));

        args.push(`--destination=${destFolder}`);
    }

    pushTo(process.env, generationOpts.webSettings, "HUGO_PARAMS_");

    // Run Hugo
    spawn(HugoPath, args, opts)
        .on('error', (error) => {
            logError && logError(`Error generating website: ${error.message}`);
        })
        .on('close', (code) => {
            if (code === 0) {
                logSuccess && logSuccess(`Website generation finished successfully.`);
            }
            else {
                logError && logError(`Website generation process exited with code ${code}.`);
            }
        });
}