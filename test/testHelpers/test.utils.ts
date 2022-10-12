import { Comment } from "../../src/workers/parse/interfaces";

/**
 * Builds command: parse input.scss --to-json -c ./test/test.settings.json [... optional flags]
 * 
 * Note that settings file should have settings.destination = "", to force 
 * output dumping to stdout (all tests read from stdout).
 * As an alternative, --dest="" flag may be used here to override settings.destination.
 * @param {string} inputFile Assets file to read * 
 * @param {Array} flags Input flags
 * @returns Array of string with the command and args 
 */
export const parseToJson = (inputFile: string, flags = ["-c", "./test/test.settings.json"]): string[] =>
    ["parse", inputFile, "--to-json", ...flags];

export function buildMinimalComment(group = "group", elemType = "mixin", name = "name"): Comment {
    return {
        group: {
            name: group
        },
        context: {
            type: elemType,
            name: name,
            line: {
                start: 10,
                end: 20
            }
        },
        lines: [],
        type: "line",
        commentRange: { start: 1, end: 10 }
    }
}

export function buildFullComment(): Comment {

    const result = buildMinimalComment();
    result.todo = "todo";
    result.aliasedGroup = {
        group: ["g1", "g2"],
        name: "name"
    };
    result.throw = "throw";
    result.path = "path";
    result.aliased = ["a", "b"];
    result.author = "author";
    result.type = "type";
    result.alias = "alias";
    result.require = {
        type: "string",
        name: "string",
        url: "string",
        description: "string",
        external: true,
        autofilled: true,
        context: {
            type: "elemType",
            name: "name"
        }
    };
    result.return = {
        type: "string",
        description: "string"
    };
    result.todo = ["t1", "t2"];
    result.access = "private";
    result.namespace = "string";
    result.usedBy = {
        context: {
            type: "elemType",
            name: "name"
        },
        description: "string"
    };
    result.link = "link";
    result.output = "output";
    result.since = "since";
    result.content = "content";
    result.see = {
        context: {
            type: "elemType",
            name: "name"
        },
        description: "string",
    };
    result.property = "property";
    result.description = "description";
    result.deprecated = "";
    result.example = [{
        type: "string",
        code: "string",
        description: "string"
    }];
    result.parameter = "parameter";
    result.groupDescription = "Description line 1.\nDescription line 2";
    result.lang = "sass";

    return result;
}

export function isSortedAsc(items: string[]): boolean {
    for (let i = 1; i < items.length; i++) {
        if (items[i - 1] >= items[i]) {
            return false;
        }
    }

    return true;

}