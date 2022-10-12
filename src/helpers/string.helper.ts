import path from "node:path";

/**
 * Returns file extension, for example "file.less" => "less".
 * @param {string} fileName File name to extract extension from. 
 * @returns {string} Extension without '.'
 **/
export const getFileExtension = (fileName: string): string => path.extname(fileName).replace('.', '').trim();

/**
 * Checks if string contains annotation symbol - @, even if it is prefixed with spaces and tabs
 * @param source String to check
 * @returns {boolean} true if string contains annotation symbol; false otherwise
 */
export const containsAnnotation = (source: string): boolean => /^\s*@/.test(source);

/**
 * Removes spaces from the beginning of code block passed in as an input string,
 * so that identation starts from the beginning.
 * @param {string | string[]} source String that contains code block with lines separated by "\n"
 * @returns {string} Code block with spaces trimmed
 */
export function trimSmart(source: string): string;
export function trimSmart(source: string[]): string[];
export function trimSmart(source: string | string[]): string | string[] {

    const isArray = source.constructor === Array;
    const lines = isArray ? source : (<string>source).split("\n");

    // Find min index of 1st non-whitespace character
    let minFirstNonSpaceIndex = indexOfNonSpace(lines[0]);
    for (const line of lines.slice(1)) {
        minFirstNonSpaceIndex = Math.min(minFirstNonSpaceIndex, indexOfNonSpace(line));
    }

    const trimmed = lines.map(x => x.slice(minFirstNonSpaceIndex));

    return isArray ? trimmed : trimmed.join("\n");
}

/**
 * Returns index of first non-whitespace symbol in a string
 * @param source Input string
 * @returns {number} Index of first non-space symbol
 **/
const indexOfNonSpace = (source: string) => source.search(/\S/);