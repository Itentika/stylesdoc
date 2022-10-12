import { Comment } from "../../workers/parse/interfaces";

export type JsonStreamResult = Array<Comment>;

export type Grouping<T> = {
    group: string,
    members: Array<T>
};


