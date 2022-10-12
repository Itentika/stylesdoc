import path from "node:path";
import Config from "./config";
import { Grouping } from "./interfaces";
import { ensureFolder } from "../../helpers/io.helper";
import { groupBy } from "../../helpers/grouping.helper";
import { Writable, WritableOptions } from "node:stream";
import { Comment } from "../../workers/parse/interfaces";
import Annotation from "../../workers/parse/annotations/base";
import { FileHandle, open, writeFile } from "node:fs/promises";
import { OutputFormat } from "../../global/enums/outputFormat";
import { MessageLogger } from "../../global/types/message.logger";
import { buildAnnotations } from "../../workers/parse/annotation.provider";
import { AggregationOptions } from "../../global/types/aggregation.options";
import { parseSortRule, sortByMembers, sortComments } from "../../helpers/sorting.helper";

const DefaultDataJsonFile = "data.json";

export default class AggregatorWritable extends Writable {
    private internalBuffer: Buffer[] = [];

    constructor(
        private readonly aggregationOpts: AggregationOptions,
        private logSuccess: MessageLogger,
        opts?: WritableOptions
    ) {
        super(opts);
    }
    
    _write(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null | undefined) => void): void {
        this.internalBuffer.push(chunk);
        callback();
    }

    async _final(callback: (error?: Error | null | undefined) => void): Promise<void> {
        let comments = this.getAllCommentsFlattened(this.internalBuffer);

        // apply post-processing
        this.postProcess(
            buildAnnotations(new Config({ isSilent: this.aggregationOpts.isSilent })),
            comments);

        this.logSuccess("All files have been parsed.");

        // sort
        comments = this.applySorting(comments, this.aggregationOpts.sort);

        // output final results        
        const data = this.aggregationOpts.grouped ? this.applyGrouping(comments) : comments;
        const json = JSON.stringify(data, undefined, 2);
        if (this.aggregationOpts.destinationPath) {
            try {
                const destination = this.ensureDestination(this.aggregationOpts.destinationPath);

                if (this.aggregationOpts.outputFormat === OutputFormat.Json) {
                    await this.writeAsJsonAsync(destination, json);
                }

            } catch (error: any) {
                callback(new Error(`Cannot write to a destination file. ${error.message}`));
            }
        }
        else {
            console.log(json); // stdout
        }
    }

    private getAllCommentsFlattened(bufferedData: Buffer[]): Comment[] {
        const commentsPerFile = bufferedData.map((chunk) =>
            JSON.parse(chunk.toString())
        ) as Comment[];

        return commentsPerFile.flat(1);
    }

    private postProcess(annotations: Annotation[], comments: Comment[]): any {
        for (const annotation of annotations.sort((a, b) => a.resolvePriority - b.resolvePriority)) {
            annotation.resolve(comments);
        }
    }

    private ensureDestination(destinationPath: string): string {
        destinationPath = destinationPath.trim();

        const destFolder = ensureFolder(destinationPath);
        return destFolder === destinationPath ? path.join(destinationPath, DefaultDataJsonFile) : destinationPath;
    }

    private async writeAsJsonAsync(destination: string, data: string) {
        let file: FileHandle | undefined;
        try {
            file = await open(destination, "w");
            await writeFile(file, data);
            this.logSuccess("JSON data has been saved to " + this.aggregationOpts.destinationPath);
        }
        finally {
            await file?.close();
        }
    }

    private applySorting(comments: Comment[], sortSettings: string[]): Comment[] {
        const rules = sortSettings.map(x => parseSortRule(x));
        return sortComments(comments, rules);
    }

    // Groups comments by "group" and then by "context.type", sort by number of members DESC
    private applyGrouping(comments: Comment[]): Grouping<Grouping<Comment>>[] {

        // Group by "group"
        let groupedByGroup = groupBy(comments, ({ group }) => group?.name);
        groupedByGroup = sortByMembers(groupedByGroup);

        // Inside each grouping - group by "context.type"
        return groupedByGroup.map(x => {
            return {
                ...x,
                members: groupBy(x.members, ({ context: { type } }) => type)
            } as Grouping<Grouping<Comment>>
        });
    }
}
