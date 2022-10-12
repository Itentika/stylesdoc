import "mocha";
import { expect } from "chai";
import { groupBy } from "../../../src/helpers/grouping.helper";
import { Comment } from "../../../src/workers/parse/interfaces";
import { buildMinimalComment } from "../../testHelpers/test.utils";

const getExpected = (items: Comment[]) => ({
    group: items[0].group.name,
    names: items.map(x => x.context.name),
    length: items.length
});

describe("helper: groupBy", () => {
    const groupName1 = "group1";
    const group1 = [
        buildMinimalComment(groupName1, "mixin", "mixin1-1"),
        buildMinimalComment(groupName1, "mixin", "mixin1-2"),
        buildMinimalComment(groupName1, "placeholder", "place1-1"),
        buildMinimalComment(groupName1, "placeholder", "place1-2"),
        buildMinimalComment(groupName1, "variable", "var1-1"),
        buildMinimalComment(groupName1, "variable", "var1-2"),
        buildMinimalComment(groupName1, "function", "func1-1"),
        buildMinimalComment(groupName1, "function", "func1-2"),
    ];

    const groupName2 = "group2";
    const group2 = [
        buildMinimalComment(groupName2, "mixin", "mixin2-1"),
        buildMinimalComment(groupName2, "mixin", "mixin2-2"),
        buildMinimalComment(groupName2, "placeholder", "place2-1"),
        buildMinimalComment(groupName2, "placeholder", "place2-2"),
        buildMinimalComment(groupName2, "variable", "var2-1"),
        buildMinimalComment(groupName2, "variable", "var2-2"),
        buildMinimalComment(groupName2, "function", "func2-1"),
        buildMinimalComment(groupName2, "function", "func2-2"),
    ];   
    
    it("should group comments by group", () => {
        const input = [...group1, ...group2];

        const result = groupBy(input, ({ group }) => group?.name);

        expect(result).to.have.length(2);

        let grouping = result[0];
        let expected = getExpected(group1);

        expect(grouping.group).to.eq(expected.group);
        expect(grouping.members).to.have.length(expected.length);
        for (const { context: { name } } of grouping.members) {
            expect(expected.names).to.include(name);
        }

        grouping = result[1];
        expected = getExpected(group2);
        
        expect(grouping.group).to.eq(expected.group);
        expect(grouping.members).to.have.length(expected.length);
        for (const { context: { name } } of grouping.members) {
            expect(expected.names).to.include(name);
        }
    })
});