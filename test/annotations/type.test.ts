import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";

const file = "test/assets/annotation.item.type.scss";

describe("@type", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (type)", (ctx) => {
            const jsonResult = JSON.parse(ctx.stdout) as Comment[];
            const [variable, ...ignored] = jsonResult;

            expect(variable.type).to.be.eq("Number | String");

            for (const { type: x } of ignored) {
                expect(x).to.be.undefined; // ignored;    
            }
        });
});