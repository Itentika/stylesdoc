import "mocha";
import { expect } from "chai";
import { parseColorScheme } from "../../src/helpers/enum.helper";
import { ColorScheme } from "../../src/global/enums/colorScheme";

describe("enum helpers: parseColorScheme", () => {

    it("should allow supported theme (ignore case)", () => {
        const input = [
            { actual: "light", expected: ColorScheme.Light },
            { actual: "dark", expected: ColorScheme.Dark },
            { actual: "green", expected: ColorScheme.Green },
            { actual: "blue", expected: ColorScheme.Blue },
            { actual: "orange", expected: ColorScheme.Orange },
            { actual: "purple", expected: ColorScheme.Purple }
        ];

        for (const x of input) {
            expect(parseColorScheme(x.actual.toUpperCase())).to.be.eq(x.expected);
        }
    });

    it("should not allow non-supported theme", () => {
        expect(parseColorScheme("un-supported theme")).to.be.undefined;
    });
});

