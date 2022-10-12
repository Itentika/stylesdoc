import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { JsonStreamResult } from "../../src/streams/parse/interfaces";

const file = "test/assets/annotation.item.output.scss";

describe("@output", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (output)", (ctx) => {
            const jsonResult = JSON.parse(ctx.stdout) as JsonStreamResult;

            expect(jsonResult[0].output).to.be.deep.eq(["Some description, part 1", "Some description, part 2"]);
            expect(jsonResult[1].output).to.be.undefined; // ignored;
            expect(jsonResult[2].output).to.be.undefined; // ignored;
            expect(jsonResult[3].output).to.be.undefined; // ignored;
        });
});