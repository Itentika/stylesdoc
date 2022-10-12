import { Getter } from "./getter";

export type SortRule<T> = {
    value: Getter<T>;
    isDesc: boolean;
};
