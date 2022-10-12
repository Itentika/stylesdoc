import fs from "node:fs/promises";
import { Comment } from "./interfaces";
import Config from "../../streams/parse/config";
import { Settings } from "../../generators/settings";
import { sortProperties } from "../../helpers/sorting.helper";
import annotationExtractor from "./annotationExtractor.model";
import { lessExtractor, scssExtractor } from "./commentExtractor.model";
import { filterAndGroup, hasDoubleSlashes, prepareCommentsInsideNamespace } from "../../helpers/parsing.helper";

export default async function parse(data: {
    path: string,
    settings: Settings,
    isSilent: boolean
}): Promise<Comment[]> {
    let fileData = await fs.readFile(data.path, { encoding: "utf8" });

    // Comments starting with // instead of /// are breaking cdocparser
    // cdocparser usually interpretes them as CSS snippets and 
    // the whole content starting from // is saved in "context.name" field.
    // Here we try to remove such mal-parsed comments before parsing
    fileData = fileData.trim().split(`\n`).filter(x => !hasDoubleSlashes(x)).join(`\n`);

    // const config = data.config;
    const config = new Config(data);

    // Parse annotations documented by user in ///-comments
    const comments = config.isLess
        ? lessExtractor.extract(fileData) as Comment[]
        : scssExtractor.extract(fileData) as Comment[];

    prepareCommentsInsideNamespace(comments);

    for (const comment of comments) {
        comment.lines = filterAndGroup(comment.lines);
    }

    return annotationExtractor(config)
        .extract(comments)
        .filter((x: Comment) => x.access && config.displayAccess.includes(x.access) || !x.access)
        .map((x: Comment) => ({ ...x, path: data.path, lang: config.lang }))
        .map((x: Comment) => sortProperties(x));
}
