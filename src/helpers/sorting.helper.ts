import { Getter } from "../global/types/getter";
import { SortRule } from "../global/types/sort.rule";
import { Comment } from "../workers/parse/interfaces";
import { Grouping } from "../streams/parse/interfaces";

const SORT_REGEX = /(?<value>\w+)\s*(?<order>[<>])/i;
const compare = (a: any, b: any) => {
    if (typeof a === "string" && typeof b === "string")
    {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    }
    
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

/**
 * Sorts properties of Comment alphabetically, but moving first a set of pre-defined items. 
 * @param {Comment} comment Object to sort properties of
 * @returns {Comment} Object with sorted properties
 */
export function sortProperties(comment: Comment): Comment {
    const shouldBeFirst: Array<keyof Comment> = [
        "path",
        "deprecated",
        "group",
        "example",
        "access",
        "since",
        "author",
        "todo"
    ];

    const entries = Object.keys(comment)
        .sort((a: string, b: string) => {
            const aIndex = shouldBeFirst.indexOf(a as keyof Comment);
            const bIndex = shouldBeFirst.indexOf(b as keyof Comment);

            // not found in shouldBeFirst -- apply regular sorting
            if (aIndex < 0 && bIndex < 0) {
                return compare(a, b);
            }

            if (aIndex >= 0 && bIndex < 0) {
                return -1;
            }

            if (aIndex < 0 && bIndex >= 0) {
                return 1;
            }

            // both are in shouldBeFirst - sort regarding position in shouldBeFirst

            return compare(aIndex, bIndex);
        })
        .map(key => {
            return [key, comment[key as keyof Comment]];
        });

    return Object.fromEntries(entries) as Comment;
}

/**
 * Sorts groups by number of members - groups with bigger number of members go first. 
 * @param {Array} groups Array of Grouping<T> items
 * @param isDesc Sorting order, true by default
 * @returns Array of Grouping<T> items, sorted by members number DESC 
 */
export function sortByMembers<T>(groups: Grouping<T>[], isDesc = true): Grouping<T>[] {

    return groups.sort((a: Grouping<T>, b: Grouping<T>) => {
        const order = (isDesc) ? -1 : 1;
        return order * compare(a.members.length, b.members.length);
    });
}

/**
 * Sorts comments according specified rules.
 * @param {Array} comments Comments to sort
 * @param {Array} rules Sorting rules that specify sort value and order
 * @returns Array of sorted Comments, if no rules passed in - no sorting will be done.
 */
export function sortComments(comments: Comment[], rules?: Array<SortRule<Comment>>): Comment[] {
    if (!rules?.length) {
        return comments;
    }

    return comments.sort((a: Comment, b: Comment) => {
        let sortIndex = 0;

        for (const sorting of rules) {
            const aValue = sorting.value(a);
            const bValue = sorting.value(b);

            const order = (sorting.isDesc) ? -1 : 1;
            sortIndex = order * compare(aValue, bValue);

            if (sortIndex !== 0) break;
        }

        return sortIndex;
    });
}

/**
 * Accepts sorting line from config. Format of input: 
 * - "field>" or "field >" = sort by field DESC,  
 * - "field<" or "field <" = sort by field ASC
 * @param sortLine Text input describing sorting
 * @returns Instance of SortRule<Comment> class
 */
export function parseSortRule(sortLine: string): SortRule<Comment> {
    const match = SORT_REGEX.exec(sortLine);
    return {
        isDesc: parseIsDesc(match?.groups?.order),
        value: parseValue(match?.groups?.value)
    };
}

const parseIsDesc = (order: string | undefined): boolean => order?.trim() === ">";

const parseValue = (value: string | undefined): Getter<Comment> => {
    switch (value) {
        case "group": return ({ group }) => group?.name;
        case "path": return ({ path }) => path;
        case "access": return ({ access }) => access;
        default:
            return () => {};
    }
};