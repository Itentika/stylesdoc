import { expect, test } from "@oclif/test";
import { parseToJson } from "../testHelpers/test.utils";
import { Comment } from "../../src/workers/parse/interfaces";
import { DefaultGroup } from "../../src/streams/parse/config";

const file = "test/assets/annotation.item.group.scss";

describe("@group", () => {
    test
        .stdout()
        .command(parseToJson(file))
        .it("should parse item annotation (group)", (ctx) => {
            const [longNamed, ...comments] = JSON.parse(ctx.stdout) as Comment[];

            expect(longNamed.group).to.be.deep.eq(
                {
                    name: "long name in lower case",
                    description: "Group description, line 1\nGroup description, line 2"
                });

            const withAnnotatedValue = comments.slice(0, 5);
            for (const { group: x } of withAnnotatedValue) {
                expect(x).to.be.deep.eq({
                    name: "test group"
                });
                expect(x).to.not.have.property("description");
            }

            const withDefaultValue = comments.slice(5, - 1);
            for (const { group: x } of withDefaultValue) {
                expect(x).to.be.deep.eq({
                    name: DefaultGroup
                });
                expect(x).to.not.have.property("description");
            }

            const shouldBeLowerCase = comments[comments.length - 1];
            expect(shouldBeLowerCase.group.name).to.be.deep.eq(shouldBeLowerCase.group.name.toLowerCase());
        });
});