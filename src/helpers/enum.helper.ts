import { ColorScheme } from "../global/enums/colorScheme";
import { AccessType } from "../global/enums/acessType";
import { ElementType } from "../global/enums/elementType";

/**
 * Returns value of ColorScheme enum if such color scheme is one of the supported by current Hugo setup 
 * @param {string} value Value to check.
 * @returns One of the ColorScheme enum value or undefined.
 */
export function parseColorScheme(value: string | undefined): ColorScheme | undefined {
    return Object.values(ColorScheme).find(x => x === value?.toLowerCase()) as ColorScheme;
}

/**
 * Returns value of ElementType enum if found
 * @param {string} value Value to check 
 * @returns One of the ElementType enum value or undefined.
 */
export function parseElementType(value: string | undefined): ElementType | undefined {
    return Object.values(ElementType).find(x => x === value?.toLowerCase()) as ElementType;
}

/**
 * Returns value of AccessType enum if found
 * @param {string} value Value to check 
 * @returns One of the AccessType enum value or undefined.
 */
export function parseAccessType(value: string | undefined): AccessType | undefined {
    const values = Object.values(AccessType);
    return get(values, value);
}

function get<T extends any>(source: T[], value: string | undefined): T | undefined {
    return source.find(x => x === value?.toLowerCase()) as T;
}