import { expect, test } from "@oclif/test";
import { Comment } from "../../src/workers/parse/interfaces";
import { parseToJson } from "../testHelpers/test.utils";

const file = "test/assets/annotation.item.see.scss";

describe("@see", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (see)", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as Comment[];
            const [source, ...referenced] = comments;

            expect(source.see.length).to.be.eq(referenced.length);

            for (let i = 0; i < source.see.length; i++) {
                const see = source.see[i];
                const reference = referenced[i];

                expect(see.group).to.be.eq(reference.group.name);
                expect(see.context).to.be.deep.eq(reference.context);
                expect(see.description).to.be.deep.eq(reference.description);
            }

            for (const x of referenced) {
                expect(x.see).to.have.lengthOf(3);
                expect(x.context.name).to.not.eq("non-existing-element");
            }
        });
});