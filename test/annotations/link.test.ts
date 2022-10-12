import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";

const file = "test/assets/annotation.item.link.scss";

describe("@link", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (link)", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as Comment[];
            const expected = [
                { url: "http://example1.com", caption: "" },
                { url: "http://example2.com", caption: "test link 2" }
            ];

            for (const { link: x } of comments) {
                expect(x).to.be.deep.eq(expected);
            }
        });
});