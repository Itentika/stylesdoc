import Annotation from "./base";
import { AliasDescription, Comment, RequireElement } from "../interfaces";

function updateReferences(comments: Comment[], oldName: string, newName: string) {
    for (const comment of comments) {

        if (comment.alias) {
            comment.alias.name = comment.alias?.name === oldName ? newName : comment.alias?.name;
        }

        comment.aliased =
            comment.aliased?.map((x: string) => x === oldName ? newName : x);

        comment.aliasedGroup =
            comment.aliasedGroup?.map((x: AliasDescription) => x.name === oldName ? { ...x, name: newName } : x);

        comment.require =
            comment.require?.map((x: RequireElement) => x.name === oldName ? { ...x, name: newName } : x);
    }
}

export default class Name extends Annotation {
    name = "name";
    multiple = false;
    allowedInPoster = false;
    resolvePriority = 100;

    parse(line: string): { [name: string]: any } | string {
        return line.trim(); // save value as "name" property to be processed during resolve
    };

    // If name is set - overwrite item.context.name
    resolve(comments: Comment[]): Comment[] {

        for (const comment of comments) {
            if (comment.name) {
                updateReferences(comments, comment.context.name ?? "", comment.name);

                comment.context.name = comment.name;
            }

            delete comment.name;
        }

        return comments;
    };
}
