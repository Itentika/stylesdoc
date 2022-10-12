import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";
import { JsonStreamResult } from "../../src/streams/parse/interfaces";

const file = "test/assets/annotation.item.throw.scss";

describe("@throw", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (throw)", (ctx) => {
            const jsonResult = JSON.parse(ctx.stdout) as JsonStreamResult;
            const [
                error1, error2, error3,
                autofilled1, autofilled2, autofilled3,
                unique,
                ...ignored
            ] = jsonResult;

            let expected = ["Error 1", "Error 2"];
            expect(error1.throw).to.be.deep.eq(expected);
            expect(error2.throw).to.be.deep.eq(expected);
            expect(error3.throw).to.be.deep.eq(expected);

            expected = ["Error from annotation", "Should be added as autofilled error description"];
            expect(autofilled1.throw).to.be.deep.eq(expected);
            expect(autofilled2.throw).to.be.deep.eq(expected);
            expect(autofilled3.throw).to.be.deep.eq(expected);

            expected = ["Error from annotation", "Other error"];
            expect(unique.throw).to.be.deep.eq(expected);

            for (const { throw: x } of ignored) {
                expect(x).to.be.undefined; // ignored;    
            }
        });

    test
        .stdout()
        .command(parseToJson(file, ["-c", "./test/test.settings.no-autofill.json"]))
        .it("should skip autofill when disabled globally", (ctx) => {
            const comments = JSON.parse(ctx.stdout);

            const autofilled = comments.filter((x: Comment) => (<Comment>x).context.name.endsWith("autofilled"));

            for (const { throw: x } of autofilled) {
                expect(x).to.be.deep.eq(["Error from annotation"]);
            }
        });
});