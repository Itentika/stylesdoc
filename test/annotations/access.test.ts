import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";

const file = "test/assets/annotation.item.access.scss";

describe("@access", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation", (ctx) => {
            const [defaultValue, publicValue, special, ...other] = JSON.parse(ctx.stdout) as Comment[];

            expect(defaultValue.access).to.be.deep.eq("public");
            expect(publicValue.access).to.be.deep.eq("public");
            expect(special.access).to.be.deep.eq("public");

            expect(other).not.to.be.empty;
            for (const { access: x } of other) {
                expect(x).to.be.deep.eq("private");
            }
        });

    
    test
        .stdout()
        .command(parseToJson(file, ["-c", "./test/test.settings.no-autofill.json"]))
        .it("should skip autofill when disabled globally", (ctx) => {
            const comments = JSON.parse(ctx.stdout);

            const autofilled = comments.filter((x: Comment) => (<Comment>x).context.name.endsWith("autofilled"));

            expect(autofilled.length).to.be.eq(8);
            for (const { access: x } of autofilled) {
                expect(x).to.be.deep.eq("public");
            }
        });
});