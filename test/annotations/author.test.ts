import { expect, test } from "@oclif/test";
import { Comment } from "../../src/workers/parse/interfaces";
import { parseToJson } from "../testHelpers/test.utils";

const file = "test/assets/annotation.item.author.scss";

describe("@author", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (author)", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as Comment[];
            const expected = ["John Doe", "Foo Bar"];

            for (const { author: x } of comments) {
                expect(x).to.be.deep.eq(expected);
            }
        });
})