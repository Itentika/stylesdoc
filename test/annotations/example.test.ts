import { expect, test } from "@oclif/test";
import Config from "../../src/streams/parse/config";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";
import { Example } from "../../src/workers/parse/annotations";

const ext = "scss";
const file = "test/assets/annotation.item.example." + ext;

describe("@example", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (example)", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as Comment[];

            let example = comments[0].example[0];
            expect(example).to.be.deep.eq(
                { type: "html", code: "<div>\n  Something\n</div>", description: "some example" }
            );

            example = comments[1].example[0];
            expect(example).to.be.deep.eq(
                { type: "scss", code: "example-function(2)\nresult: 3", description: "function usage" }
            );

            example = comments[2].example[0];
            expect(example).to.be.deep.eq(
                { type: "scss", code: ".div, %example-placeholder {\n  font-weight: bold;\n}", description: "placeholder usage" }
            );

            example = comments[3].example[0];
            expect(example).to.be.deep.eq(
                { type: "scss", code: ".div {\n  border: 1px solid $example-variable;\n}", description: "variable usage" }
            );

            example = comments[4].example[0];
            expect(example.type).to.be.eq(ext);

            example = comments[5].example[0];
            expect(example).to.be.deep.eq(
                { type: "scss", code: "src/file as namespace-name", description: "use usage" });
        });

    it("should set file extension as default type of code snippet", () => {
        const expected = "test_extension";
        const config = new Config({ path: "file." + expected });

        const result = new Example(config).parse("");

        expect(result.type).to.be.eq(expected);
    });
});