import { expect, test } from "@oclif/test";
import { Comment } from "../../src/workers/parse/interfaces";
import { parseToJson } from "../testHelpers/test.utils";

const file = "test/assets/annotation.item.alias.scss";

describe("@alias", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (alias)", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as Comment[];
            const [source, alias1, alias2, noAlias, ...ignored] = comments;

            expect(source.aliased).to.be.deep.eq(["source-alias-1", "source-alias-2"]);
            expect(source.aliasedGroup).to.be.deep.eq([
                {
                    name: "source-alias-1",
                    group: "group1",
                    type: "function",
                },
                {
                    name: "source-alias-2",
                    group: "group2",
                    type: "function",
                }]);

            const expected = {
                name: "source",
                group: "source-group",
                type: "function",
            };
            expect(alias1.alias).to.be.deep.eq(expected);
            expect(alias2.alias).to.be.deep.eq(expected);

            expect(noAlias).to.not.have.property("alias");

            for (const { alias: x } of ignored) {
                expect(x).to.be.undefined; // ignored;    
            }
        });
});