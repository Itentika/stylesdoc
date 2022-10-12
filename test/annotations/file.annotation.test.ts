import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { JsonStreamResult } from "../../src/streams/parse/interfaces";

const file = "test/assets/annotation.file.scss";

describe("parse file annotation", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse file annotation (poster)", (ctx) => {
            const [comment] = JSON.parse(ctx.stdout) as JsonStreamResult;

            expect(comment.group).to.be.deep.eq({ name: "api" });
            expect(comment.access).to.be.eq("private");
            expect(comment.deprecated).to.be.eq("deprecated description");
            expect(comment.author).to.be.deep.equal(["Andrew M", "Paul D"]);
            expect(comment.link).to.be.deep.eq([
                { url: "http://example.com", caption: "test link" },
                { url: "http://source.com", caption: "" },
            ]);
            expect(comment.since).to.be.deep.eq(
                { version: "0.0.1", description: "test description" }
            );

            // Some annotations are not allowed in file annotation
            expect(comment).to.not.have.property("alias");
            expect(comment).to.not.have.property("content");
            expect(comment).to.not.have.property("example");
            expect(comment).to.not.have.property("output");
            expect(comment).to.not.have.property("parameter");
            expect(comment).to.not.have.property("property");
            expect(comment).to.not.have.property("require");
            expect(comment).to.not.have.property("return");
            expect(comment).to.not.have.property("see");
            expect(comment).to.not.have.property("throw");
            expect(comment).to.not.have.property("type");
            expect(comment).to.not.have.property("namespace");
        });
});