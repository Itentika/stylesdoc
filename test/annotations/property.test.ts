import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { JsonStreamResult } from "../../src/streams/parse/interfaces";
import { DefaultPropertyType } from "../../src/workers/parse/annotations/property";

const file = "test/assets/annotation.item.property.scss";

describe("@property", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (property)", (ctx) => {
            const jsonResult = JSON.parse(ctx.stdout) as JsonStreamResult;

            let properties = jsonResult[0].property;
            expect(properties.length).to.be.eq(2);
            expect(properties[0]).to.be.deep.eq(
                { name: "base.first", type: "String", default: "\"default\"", description: "description" });
            expect(properties[1]).to.be.deep.eq(
                { name: "base.second", type: "Number", default: "42", description: "description" });

            properties = jsonResult[1].property;
            expect(properties[0].type).to.be.eq(DefaultPropertyType);

            properties = jsonResult[2].property;
            for (const p of properties) {
                expect(p).to.be.deep.eq(
                    { 
                        name: "some_name", 
                        type: "some_type", 
                        default: "\"default_value\"", 
                        description: "Alias for property" });
            }

            expect(jsonResult[3].property).to.be.undefined; // ignored;
            expect(jsonResult[4].property).to.be.undefined; // ignored;
            expect(jsonResult[5].property).to.be.undefined; // ignored;
        })
});