import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";

const file = "test/assets/annotation.item.todo.scss";

describe("@todo", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (todo)", (ctx) => {
            const jsonResult = JSON.parse(ctx.stdout) as Comment[];

            const expected = ["Task 1", "Task 2"];
            
            for (const { todo: x } of jsonResult) {
                expect(x).to.be.deep.eq(expected);
            }
        });
});