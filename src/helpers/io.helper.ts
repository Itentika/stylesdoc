import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

/**
 * If destinationPath is a file "c:\temp\output\data.json" - returns inner-most parent folder "c:\temp\output\",
 * otherwise, if destinationPath = "c:\temp\output" - returns the folder itself
 * @param destinationPath Path to file or directory to check
 * @returns Path to folder that was ensured to exists (created)
 */
export function ensureFolder(destinationPath: string) : string {
    const info = path.parse(destinationPath);

    if (!info.ext && existsSync(destinationPath)) {
        return destinationPath;
    }

    const parent = path.dirname(destinationPath);
    ensureFolder(parent); // ensure parent folder exists
    
    if (!info.ext) {
        mkdirSync(destinationPath);
        return destinationPath;
    }

    return parent; // return parent folder that was ensured
}