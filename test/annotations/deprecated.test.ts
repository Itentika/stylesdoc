import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";

const file = "test/assets/annotation.item.deprecated.scss";

describe("@deprecated", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (deprecated)", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as Comment[];

            for (const { deprecated: x } of comments) {
                expect(x).to.be.deep.eq("descrition of why the item is deprecated");
            }
        });
});