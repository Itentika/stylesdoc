import { Getter } from "../global/types/getter";
import { Grouping } from "../streams/parse/interfaces";

/**
 * Groups items by a value, obtained by getter-function passed in. 
 * @param {Array} items Array of items to group
 * @param {Function} getter Function that extracts value from each item, the value items are grouped by
 * @returns Grouping<T> object in format: 
 * {
 *   "group": "grouping value",
 *   "members": array of items, each of them contains "grouping value"
 * }
 */
export function groupBy<T>(items: T[], getter: Getter<T>): Grouping<T>[] {
    const grouped: Record<string, any> = {};

    for (const item of items) {
        const key = getter(item);
        grouped[key] = [...grouped[key] || [], item];
    }

    // Convert to Grouping object
    return Object.entries(grouped).map(([key, values]) => ({
        group: key,
        members: values
    } as Grouping<T>));
}