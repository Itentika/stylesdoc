import "mocha";
import { expect, test } from "@oclif/test";
import { parseToJson } from "../../../testHelpers/test.utils";
import { DefaultGroup } from "../../../../src/streams/parse/config";
import { JsonStreamResult } from "../../../../src/streams/parse/interfaces";

const file = "test/assets/parse.namespace.less";

describe("less context parser", () => {
    const command = test.stdout().command(parseToJson(file));

    command
        .it("should parse namespaces", (ctx) => {
            const [namespace, inner1, inner2, outer] = JSON.parse(ctx.stdout) as JsonStreamResult;

            expect(namespace.author).to.be.deep.eq(["somebody"]);
            expect(namespace.context.name).to.be.eq("#outer");
            expect(namespace.context.type).to.be.eq("namespace");
            expect(namespace.context.value).to.be.empty;

            expect(inner1.context.name).to.be.eq("#outer.m2");
            expect(inner1.context.type).to.be.eq("css");
            expect(inner1.author).to.be.deep.eq(["somebody else"]);

            expect(inner2.context.name).to.be.eq("#outer.m3");
            expect(inner2.context.type).to.be.eq("mixin");
            expect(inner2.require).to.be.deep.eq([{
                name: "#other_namespace.outside",
                type: "css",
                external: false,
                group: DefaultGroup
            }]);

            expect(outer.context.name).to.be.eq("#other_namespace.outside");
            expect(outer.context.type).to.be.eq("css");
        });

    command
        .it("should support supported annotations for .less #namespace", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as JsonStreamResult;
            const supported = comments[comments.length - 2];

            expect(supported.access).to.be.eq("private");
            expect(supported.author).to.be.deep.eq(["Test Author"]);
            expect(supported.deprecated).to.be.eq("smth");
            expect(supported.group).to.be.deep.eq({ name: "testgroup" });
            expect(supported.context.name).to.be.eq("some name");
            expect(supported.todo).to.be.deep.eq(["to be done"]);
            expect(supported.since).to.be.deep.eq({
                version: "1.3.0", description: "new version"
            });
            expect(supported.example).to.be.deep.eq([{
                type: "less",
                code: "2+3",
                description: ""
            }]);
        });

    command
        .it("should ignored non-supported annotations for .less #namespace", (ctx) => {
            const comments = JSON.parse(ctx.stdout) as JsonStreamResult;
            const ignored = comments[comments.length - 1];

            expect(ignored).to.not.have.property("alias");
            expect(ignored).to.not.have.property("content");
            expect(ignored).to.not.have.property("ignore");
            expect(ignored).to.not.have.property("link");
            expect(ignored).to.not.have.property("namespace");
            expect(ignored).to.not.have.property("output");
            expect(ignored).to.not.have.property("parameter");
            expect(ignored).to.not.have.property("property");
            expect(ignored).to.not.have.property("require");
            expect(ignored).to.not.have.property("return");
            expect(ignored).to.not.have.property("see");
            expect(ignored).to.not.have.property("throw");
            expect(ignored).to.not.have.property("type");
        });

})