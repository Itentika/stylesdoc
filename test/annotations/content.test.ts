import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";
import { JsonStreamResult } from "../../src/streams/parse/interfaces";
import { DefaultContentText } from "../../src/workers/parse/annotations/content";

const file = "test/assets/annotation.item.content.scss";

describe("@content", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (content)", (ctx) => {
            const [content, autofilled, ignored] = JSON.parse(ctx.stdout) as JsonStreamResult;

            expect(content.content).to.be.eq("Some content description");
            expect(autofilled.content).to.be.eq(DefaultContentText); // autofilled
            expect(ignored.content).to.be.undefined; // ignored
        });


    test
        .stdout()
        .command(parseToJson(file, ["-c", "./test/test.settings.no-autofill.json"]))
        .it("should skip autofill if it was disabled globally", (ctx) => {
            const comments = JSON.parse(ctx.stdout);

            const autofilled = comments.filter((x: Comment) => (<Comment>x).context.name.endsWith("autofilled"));

            for (const { content: x } of autofilled) {
                expect(x).to.be.undefined;
            }
        });    
});