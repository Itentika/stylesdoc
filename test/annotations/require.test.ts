import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { RequireElement } from "../../src/workers/parse/interfaces";

const file = "test/assets/annotation.item.require.scss";

describe("@require", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (require)", (ctx) => {
            const [source, autofilled, ...other] = JSON.parse(ctx.stdout);

            expect(source.require[0]).to.be.deep.eq(
                {
                    type: "function",
                    name: "example-function",
                    description: "This is a description, prefixed by dash.",
                    external: false,
                    group: "group2"
                }
            );

            expect(source.require[1]).to.be.deep.eq(
                {
                    type: "mixin",
                    name: "example-mixin",
                    description: "This is a description with no dash.",
                    external: false,
                    group: "group1"
                }
            );

            expect(source.require[2]).to.be.deep.eq(
                {
                    type: "variable",
                    name: "example-variable",
                    external: false,
                    group: "main"
                }
            );

            expect(source.require[3]).to.be.deep.eq(
                {
                    type: "placeholder",
                    name: "example-placeholder",
                    description: "This is a internal description, so link is omitted in result.",
                    external: false,
                    group: "main"
                }
            );

            expect(source.require[4]).to.be.deep.eq(
                {
                    type: "function",
                    name: "this::is::an::external::dependancy",
                    description: "External dependency with double colon",
                    external: true,
                    url: "http://github.com"
                }
            );

            expect(source.require[5]).to.be.deep.eq(
                {
                    type: "function",
                    name: "this:is:an:external:dependancy",
                    description: "External dependency with single colon",
                    external: true,
                    url: "http://github.com"
                }
            );

            expect(source.require[6]).to.be.deep.eq(
                {
                    type: "function",
                    name: "this/is/an/external/dependancy",
                    description: "External dependency with slash",
                    external: true,
                    url: "http://github.com"
                }
            );

            expect(source.require[7]).to.be.deep.eq(
                {
                    type: "variable",
                    name: "this.is.an.external.dependancy",
                    description: "External dependency with dot",
                    external: true,
                    url: "http://github.com"                    
                }
            );

            // Non-exisitng items are removed from ouptut
            let names: string[] = source.require.map((x: RequireElement) => x.name);
            expect(names).to.not.include.members(["non-existing-placeholder"])

            // Testing autofill
            names = autofilled.require.map((x: RequireElement) => x.name);
            expect(names).to.include.deep.members([
                "some.external.dependancy", "example-mixin", "autofilled-mixin",
                "example-placeholder", "example-placeholder-2", "example-function",
                "example-function-2", "example-variable", "example-variable-2"]);

            // No duplicates
            expect(names.filter(x => x === "autofilled-mixin")).to.have.lengthOf(1);
            expect(names.filter(x => x === "example-placeholder-2")).to.have.lengthOf(1);
            expect(names.filter(x => x === "example-variable-2")).to.have.lengthOf(1);
            expect(names.filter(x => x === "example-function-2")).to.have.lengthOf(1);

            // No non-existing items
            expect(names).to.not.include.deep.members(["non-existing-mixin"]);

            // Require annotation work for items
            const referencesOfSource = new Set(["example-mixin", "example-function", "example-variable", "example-placeholder"]);
            const references = other.filter((x: any) => referencesOfSource.has(x.context.name));
            for (const { require: x } of references) {
                expect(x[0]).to.be.deep.eq({
                    name: "source",
                    type: "function",
                    external: false,
                    "group": "main"
                });
            }

        });
});