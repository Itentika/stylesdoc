import { Comment, Context } from "../workers/parse/interfaces";
import { parseElementType } from "./enum.helper";
import { ElementType } from "../global/enums/elementType";
import { containsAnnotation } from "./string.helper";

export const findCodeStart = function (
    ctxCode: string,
    lastMatch: number
): number {
    const codeStart = ctxCode.indexOf("{", lastMatch);

    if (codeStart < 0 || ctxCode[codeStart - 1] !== "#") {
        return codeStart;
    }

    return findCodeStart(ctxCode, codeStart + 1);
};

export const addCodeToContext = (
    context: Context,
    ctxCode: string,
    match: RegExpExecArray
): number | undefined => {
    const codeStart = findCodeStart(ctxCode, match.index);

    if (codeStart >= 0) {
        context.snippet = extractCode(ctxCode, codeStart);
        return codeStart + (context.snippet?.length ?? 0) + 1;
    }
};

// eslint-disable-next-line complexity
export function extractCode(code: string, offset = 0): string {
    if (code[offset] !== "{") {
        offset = code.indexOf("{", offset);
    }

    const start = offset + 1;
    let index = start;
    let depth = 1;
    const length = code.length;

    let inString = false;
    let openChar = "";

    let inComment = false;

    while (index < length && depth > 0) {
        const charBefore = code[index - 1];
        const char = code[index];
        const charNext = code[index + 1];

        if (!inString) {
            if (char === "/" && charNext === "/" && !inComment) {
                index = Math.min(
                    Math.max(code.indexOf("\r", index), code.indexOf("\n", index)),
                    length
                );
                continue;
            } else if (char === "/" && charNext === "*") {
                index += 2;
                inComment = true;
                continue;
            } else if (char === "*" && charNext === "/") {
                index += 2;
                inComment = false;
                continue;
            }
        }

        if (!inComment && (char === '"' || char === "'") && charBefore !== "\\") {
            if (!inString) {
                openChar = char;
                inString = true;
                index++;
                continue;
            } else if (openChar === char) {
                inString = false;
                index++;
                continue;
            }
        }

        if (!(inString || inComment)) {
            if (char === "{") {
                depth++;
            } else if (char === "}") {
                depth--;
            }
        }

        index++;
    }

    if (depth > 0) {
        return "";
    }

    index--;
    return code.slice(start, index);
}

export function filterAndGroup(lines: string[]): string[] {
    const nLines = [];
    let group = false;

    for (const line of lines) {
        const isAnnotation = containsAnnotation(line);

        if (line.trim().indexOf("---") !== 0) {
            // Ignore lines that start with "---"
            if (group) {
                if (isAnnotation) {
                    nLines.push(line.trim());
                } else if (line !== "") {
                    nLines[nLines.length - 1] += "\n" + line;
                }
            } else if (isAnnotation) {
                group = true;
                nLines.push(line.trim());
            } else {
                nLines.push(line);
            }
        }
    }

    return nLines;
}

/**
 *  Updates comments that are inside LESS namespaces (eg. '#ns { ... }'): 
 *  - adds namespace name as prefix: #namespace_name.item_name 
 * @param {Array} comments Array of Comments to process
 * @return void
 */
export function prepareCommentsInsideNamespace(comments: Comment[]): void {
    const namespaces = comments.filter(x => x.context.type === ElementType.NAMESPACE);

    for (const comment of comments.filter(x => x.context.type !== ElementType.NAMESPACE)) {
        const parent = namespaces.find(x => isInside(x, comment));
        if (parent === undefined) continue;

        const { context: { name: namespace } } = parent;
        comment.context.name = `${namespace}${comment.context.name}`;        
    }
}

/**
 *  Checks if inner element is inside outer.
 * 
 * @param {Comment} outer outer element
 * @param {Comment} inner inner element
 * @return {boolean} 'true' if inner is inside outer; 'false' otherwise
 */
export function isInside({ context: { line: outer } }: Comment, { context: { line: inner } }: Comment): boolean {
    if (!outer || !inner) {
        return false;
    }

    return outer.start <= inner.start && inner.end <= outer.end;
}

export function hasDoubleSlashes(source: string): boolean {
    // very begining THEN any space THEN // THEN any char but '/'
    return /^\s*\/{2}(?!\/)/.test(source ?? "");
}

export function isEmptyObject<T extends Record<string, unknown>>(obj: T | undefined): boolean {
    return obj === undefined || Object.values(obj).every(x => !x);
}

export function trimQuotes(source: string): string {
    return (source ?? "").trim().replace(/^["']+/, "").replace(/["']+$/, "");
}

export function getSupportedName(name: string): string {
    return parseElementType(name?.toLowerCase()) ?? ElementType.OTHER;    
}