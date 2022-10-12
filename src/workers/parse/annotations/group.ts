import Annotation from "./base";
import { GroupDescription } from "../interfaces";

export default class Group extends Annotation {
    name = "group";
    multiple = false;

    default():  { [name: string]: any } | undefined  {
        return {
            name: this.config.defaultGroup
        };
    }

    parse(line: string, ): GroupDescription | undefined {
        // If @group contains several lines - use the 1st as group name,
        // save the rest in groupDescription
        const lines = (line.trim() ?? "").split("\n");

        const group: GroupDescription = {
            name: this.config.tryReplaceGroup(lines[0])
        };

        if (lines.length > 1) {
            group.description = lines.slice(1).join("\n");
        }

        return group;
    }
}

