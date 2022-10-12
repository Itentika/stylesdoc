import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";

const file = "test/assets/annotation.item.namespace.scss";

describe("@namespace", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (namespace)", (ctx) => {
            const [use1, use2, use3, ...other] = JSON.parse(ctx.stdout) as Comment[];
            
            expect(use1.namespace).to.be.eq("from_sass");
            expect(use1.context.name).to.be.eq("from_sass");
            expect(use1.context.params.quoteData).to.be.eq("src/subfolder/testing.scss");

            expect(use2.namespace).to.be.eq("testing");
            expect(use2.context.name).to.be.eq("testing");
            expect(use2.context.params.quoteData).to.be.eq("testing.scss");
            
            expect(use3.namespace).to.be.eq("test_namespace");
            expect(use3.context.name).to.be.eq("test_namespace");
            expect(use3.context.params.quoteData).to.be.eq("some/test_namespace");

            for (const x of other) {
                expect(x).to.not.have.property("namespace");
            }
        });
});