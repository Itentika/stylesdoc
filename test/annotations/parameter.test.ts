import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { JsonStreamResult } from "../../src/streams/parse/interfaces";

const file = "test/assets/annotation.item.parameter.scss";

describe("@parameter", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (parameter)", (ctx) => {
            const [{ parameter: mixinParams }, { parameter: funcParams }, ...other] = JSON.parse(ctx.stdout) as JsonStreamResult;

            expect(mixinParams.length).to.be.eq(3);
            expect(mixinParams[0]).to.be.deep.eq({ name: "width", type: "Number" });
            expect(mixinParams[1]).to.be.deep.eq(
                { name: "height", type: "Number", default: "150", description: "Height with default value 150" });
            expect(mixinParams[2]).to.be.deep.eq(
                { name: "color", type: "Number | String", default: "#010101", description: "Color with multiple types" });

            expect(funcParams.length).to.be.eq(2);
            expect(funcParams[0]).to.be.deep.eq(
                { name: "base", type: "Type1", default: "1", description: "Base with default value 1" });
            expect(funcParams[1]).to.be.deep.eq(
                { name: "exponent", type: "Type1 | Type2" });

            for (const {parameter: p} of other) {
                expect(p).to.be.undefined; // ignored;
            }
        });
});