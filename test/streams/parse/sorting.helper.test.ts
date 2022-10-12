import "mocha";
import { expect } from "chai";
import { SortRule } from "../../../src/global/types/sort.rule";
import { groupBy } from "../../../src/helpers/grouping.helper";
import { Comment } from "../../../src/workers/parse/interfaces";
import { buildFullComment, buildMinimalComment, isSortedAsc } from "../../testHelpers/test.utils";
import { sortProperties, sortByMembers, sortComments, parseSortRule } from "../../../src/helpers/sorting.helper";

describe("helper: sortProperties", () => {
    it("should sort Comment props as expected", () => {
        const input = buildFullComment();
        const expectedFirst = [
            "path",
            "deprecated",
            "group",
            "example",
            "access",
            "since",
            "author",
            "todo"
        ];

        const sorted = sortProperties(input);
        const result = Object.keys(sorted);

        const first = result.splice(0, expectedFirst.length);
        expect(first).to.be.deep.eq(expectedFirst);

        const restAreSorted = isSortedAsc(result);
        expect(restAreSorted).to.be.true;
    })
});

describe("helper: sortByMembers", () => {
    it("should sort groups by members number DESC", () => {
        const group1 = "big";
        const group2 = "small2";
        const group3 = "small3";

        const big = [
            buildMinimalComment(group1, "mixin", "mixin1-1"),
            buildMinimalComment(group1, "mixin", "mixin1-2"),
            buildMinimalComment(group1, "placeholder", "place1-1"),
            buildMinimalComment(group1, "placeholder", "place1-2"),
            buildMinimalComment(group1, "variable", "var1-1"),
            buildMinimalComment(group1, "variable", "var1-2"),
            buildMinimalComment(group1, "function", "func1-1"),
            buildMinimalComment(group1, "function", "func1-2"),
        ];

        const small2 = big.slice(2).map(x => ({ ...x, group: { ...x.group, name: group2 } }));
        const small3 = big.slice(3).map(x => ({ ...x, group: { ...x.group, name: group3 } }));

        const grouped = groupBy<Comment>([...small3, ...small2, ...big], ({ group }) => group?.name);
        const result = sortByMembers<Comment>(grouped);

        expect(result.map(x => x.group)).to.be.deep.eq([group1, group2, group3]);
    })
});

const name1 = "first";
const name2 = "SECOND";
const name3 = "Third";

const commentsForSorting = [
    { ...buildMinimalComment(name1), path: name1, access: name1 },
    { ...buildMinimalComment(name2), path: name2, access: name2 },
    { ...buildMinimalComment(name3), path: name3, access: name3 },
];


describe("helper: sortComments", () => {
    it("should sort comments by group", () => {

        const comments = [...commentsForSorting];

        const asc: SortRule<Comment> = {
            value: ({ group }) => group?.name,
            isDesc: false
        };
        const desc = { ...asc, isDesc: true };

        const resultAsc = sortComments(comments, [asc]);
        expect(resultAsc.map(x => asc.value(x))).to.be.deep.eq([name1, name2, name3], "sorting ASC");

        const resultDesc = sortComments(comments, [desc]);
        expect(resultDesc.map(x => desc.value(x))).to.be.deep.eq([name3, name2, name1], "sorting DESC");
    })
});

describe("helper: sortComments", () => {
    it("should sort comments by path", () => {

        const comments = [...commentsForSorting];

        const asc: SortRule<Comment> = {
            value: ({ path }) => path,
            isDesc: false
        };
        const desc = { ...asc, isDesc: true };

        const resultAsc = sortComments(comments, [asc]);
        expect(resultAsc.map(x => asc.value(x))).to.be.deep.eq([name1, name2, name3], "sorting ASC");

        const resultDesc = sortComments(comments, [desc]);
        expect(resultDesc.map(x => desc.value(x))).to.be.deep.eq([name3, name2, name1], "sorting DESC");
    })
});

describe("helper: sortComments", () => {
    it("should sort comments by access", () => {
        const comments = [...commentsForSorting];

        const asc: SortRule<Comment> = {
            value: ({ access }) => access,
            isDesc: false
        };
        const desc = { ...asc, isDesc: true };

        const resultAsc = sortComments(comments, [asc]);
        expect(resultAsc.map(x => asc.value(x))).to.be.deep.eq([name1, name2, name3], "sorting ASC");

        const resultDesc = sortComments(comments, [desc]);
        expect(resultDesc.map(x => desc.value(x))).to.be.deep.eq([name3, name2, name1], "sorting DESC");
    })
});

describe("helper: sortComments", () => {
    it("should sort comments by all criteria", () => {

        const comments = [
            { ...buildMinimalComment(name1), path: name1, access: name1 },
            { ...buildMinimalComment(name1), path: name2, access: name1 },
            { ...buildMinimalComment(name1), path: name2, access: name2 },

            { ...buildMinimalComment(name2), path: name1, access: name2 },
            { ...buildMinimalComment(name2), path: name2, access: name1 },
            { ...buildMinimalComment(name2), path: name2, access: name2 },

            { ...buildMinimalComment(name3), path: name1, access: name3 },
            { ...buildMinimalComment(name3), path: name2, access: name1 },
            { ...buildMinimalComment(name3), path: name2, access: name2 },
        ];

        const rules: SortRule<Comment>[] = [
            {
                value: ({ group }) => group?.name,
                isDesc: false
            },
            {
                value: ({ path }) => path,
                isDesc: true
            },
            {
                value: ({ access }) => access,
                isDesc: false
            }
        ];

        const result = sortComments(comments, rules);

        expect(result.map(x => rules[0].value(x))).to.be.deep.eq([name1, name1, name1, name2, name2, name2, name3, name3, name3], "1st sorting: group ASC");
        expect(result.map(x => rules[1].value(x))).to.be.deep.eq([name2, name2, name1, name2, name2, name1, name2, name2, name1], "2nd sorting: path DESC");
        expect(result.map(x => rules[2].value(x))).to.be.deep.eq([name1, name2, name1, name1, name2, name2, name1, name2, name3], "3rd sorting: access ASC");
    })
});

describe("helper: sortComments", () => {
    it("should not sort if rules are empty", () => {

        const comments = [
            buildMinimalComment(name3),
            buildMinimalComment(name2),
            buildMinimalComment(name1)
        ];
        
        const result = sortComments(comments, []);
        
        expect(result).to.deep.eq(comments);
    })
});

describe("helper: parseSortRule", () => {
    it("should parse sort order", () => {
        const input = ["field>", "field >", "field<", "field <"];
        
        const result = input.map(x => parseSortRule(x));
        
        expect(result.map(x => x.isDesc)).to.deep.eq([true, true, false, false]);
    })
});