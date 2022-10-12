import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";

const file = "test/assets/annotation.item.name.scss";

describe("@name", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (name)", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as Comment[];
            const renamed = comments.splice(-2);
            const ignored = comments.splice(-1);
            
            for (const comment of comments) {
                expect(comment.context.name).to.be.eq("override-name");
                expect(comment).to.not.haveOwnProperty("name");
            }

            expect(ignored).to.not.haveOwnProperty("name");
            
            expect(renamed[0].context.name).to.be.eq("new-name");
            expect(renamed[1].aliased).to.be.deep.eq(["new-name"]);
            expect(renamed[1]).to.have.nested.property("aliasedGroup[0].name", "new-name");
            expect(renamed[1]).to.have.nested.property("require[0].name", "new-name");
        });
});