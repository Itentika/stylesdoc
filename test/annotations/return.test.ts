import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { JsonStreamResult } from "../../src/streams/parse/interfaces";

const file = "test/assets/annotation.item.return.scss";

describe("@return", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (return)", (ctx) => {
            const jsonResult = JSON.parse(ctx.stdout) as JsonStreamResult;
            const [actual, aliased, ...ignored] = jsonResult;

            expect(actual.return).to.be.deep.eq(
                { type: "number | string", description: "This function returns number or string" });

            expect(aliased.return).to.be.deep.eq(
                { type: "number | string", description: "Testing alias" });

            for (const { return: x } of ignored) {
                expect(x).to.be.undefined; // ignored;
            }
        });
});