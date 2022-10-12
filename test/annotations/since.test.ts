import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";

const file = "test/assets/annotation.item.since.scss";

describe("@since", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (since)", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as Comment[];
            const expected = { version: "1.1.1", description: "test description" };

            for (const { since: x } of comments) {
                expect(x).to.be.deep.eq(expected);
            }
        });
});