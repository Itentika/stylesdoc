import { expect, test } from "@oclif/test";
import { JsonStreamResult } from "../../src/streams/parse/interfaces";
import { parseToJson } from "../testHelpers/test.utils";

const file = "test/assets/output.grouped.scss";

describe("parse using --grouped flag", () => {
    test
        .stdout()
        .command(parseToJson(file, ["-c", "./test/test.settings.no-autofill.json", "--grouped"]))
        .it("should group items by group and type", (ctx) => {
            const jsonResult = JSON.parse(ctx.stdout) as JsonStreamResult;
            expect(jsonResult).to.have.length(3);

            let group = jsonResult[0];
            expect(group).to.have.property("group", "group1");
            expect(group.members).to.have.length(4);

            expect(group).to.have.nested.property("members[0].group", "function");
            expect(group).to.have.nested.property("members[0].members[0].context.name", "func1");

            expect(group).to.have.nested.property("members[1].group", "mixin");
            expect(group).to.have.nested.property("members[1].members[0].context.name", "mix1");

            expect(group).to.have.nested.property("members[2].group", "placeholder");
            expect(group).to.have.nested.property("members[2].members[0].context.name", "place1");

            expect(group).to.have.nested.property("members[3].group", "variable");
            expect(group).to.have.nested.property("members[3].members[0].context.name", "var1");

            group = jsonResult[1];
            expect(group).to.have.property("group", "group2");
            expect(group.members).to.have.length(4);

            expect(group).to.have.nested.property("members[0].group", "function");
            expect(group).to.have.nested.property("members[0].members[0].context.name", "func2");

            expect(group).to.have.nested.property("members[1].group", "mixin");
            expect(group).to.have.nested.property("members[1].members[0].context.name", "mix2");

            expect(group).to.have.nested.property("members[2].group", "placeholder");
            expect(group).to.have.nested.property("members[2].members[0].context.name", "place2");

            expect(group).to.have.nested.property("members[3].group", "variable");
            expect(group).to.have.nested.property("members[3].members[0].context.name", "var2");

            group = jsonResult[2];
            expect(group).to.have.property("group", "group3");
            expect(group.members).to.have.length(3);

            expect(group).to.have.nested.property("members[0].group", "function");
            expect(group).to.have.nested.property("members[0].members[0].context.name", "func3");

            expect(group).to.have.nested.property("members[1].group", "mixin");
            expect(group).to.have.nested.property("members[1].members[0].context.name", "mix3");

            expect(group).to.have.nested.property("members[2].group", "placeholder");
            expect(group).to.have.nested.property("members[2].members[0].context.name", "place3");
        });
});
