import "mocha";
import { expect } from "chai";
import { trimQuotes, hasDoubleSlashes, getSupportedName, isInside, isEmptyObject } from "../../src/helpers/parsing.helper";
import { ElementType } from "../../src/global/enums/elementType";

describe("parser helpers: trimQuotes", () => {

    it("should trim leading and trailing single quotes and whitespaces", () => {
        const input = `    'http://github.com'      `;
        const result = trimQuotes(input);

        expect(result).to.be.eq("http://github.com");
    });

    it("should trim leading and trailing double quotes and whitespaces", () => {
        const input = `    "http://github.com"      `;
        const result = trimQuotes(input);

        expect(result).to.be.eq("http://github.com");
    });
})

describe("parser helpers: hasDoubleSlashes", () => {

    it("should return true if a line has double-slash comment", () => {
        expect(hasDoubleSlashes("// comment")).to.be.true;
        expect(hasDoubleSlashes("       // comment with tabbed indent")).to.be.true;
        expect(hasDoubleSlashes("//comment")).to.be.true;
        expect(hasDoubleSlashes("// /// @access private")).to.be.true;
    });

    it("should return false if a line has inline double-slash comment", () => {
        expect(hasDoubleSlashes("list-style: none; // inline comment")).to.be.false;
    });
})

describe("parser helpers: supportedName", () => {

    it("should check if mixin is supported type and return it", () => {
        expect(getSupportedName("mixin")).to.be.eq(ElementType.MIXIN);
        expect(getSupportedName("MIXin")).to.be.eq(ElementType.MIXIN);
    });

    it("should check if function is supported type and return it", () => {
        expect(getSupportedName("function")).to.be.eq(ElementType.FUNCTION);
        expect(getSupportedName("funcTION")).to.be.eq(ElementType.FUNCTION);
    });

    it("should check if variable is supported type and return it", () => {
        expect(getSupportedName("variable")).to.be.eq(ElementType.VARIABLE);
        expect(getSupportedName("VARiable")).to.be.eq(ElementType.VARIABLE);
    });

    it("should check if placeholder is supported type and return it", () => {
        expect(getSupportedName("placeholder")).to.be.eq(ElementType.PLACEHOLDER);
        expect(getSupportedName("PLACEholder")).to.be.eq(ElementType.PLACEHOLDER);
    });

    it("should check if use is supported type and return it", () => {
        expect(getSupportedName("use")).to.be.eq(ElementType.USE);
        expect(getSupportedName("USE")).to.be.eq(ElementType.USE);
    });

    it("should check if forward is supported type and return it", () => {
        expect(getSupportedName("forward")).to.be.eq(ElementType.FORWARD);
        expect(getSupportedName("FORWARD")).to.be.eq(ElementType.FORWARD);
    });

    it("should check if css is supported type and return it", () => {
        expect(getSupportedName("css")).to.be.eq(ElementType.CSS);
        expect(getSupportedName("CSS")).to.be.eq(ElementType.CSS);
    });

    it("should check if type is NOT supported and return 'others'", () => {
        expect(getSupportedName("something")).to.be.eq(ElementType.OTHER);
        expect(getSupportedName("")).to.be.eq(ElementType.OTHER);
        expect(getSupportedName("     ")).to.be.eq(ElementType.OTHER);
    });
})

describe("parser helpers: isInside", () => {

    it("should return true if an element is inside outer element", () => {
        const outer = {
            context: {
                line: { start: 10, end: 20 }
            }
        };
        const inner = {
            context: {
                line: { start: 15, end: 20 }
            }
        };

        expect(isInside(outer, inner)).to.be.true;
    });
    
    it("should return false if an element is outside outer element", () => {
        const outer = {
            context: {
                line: { start: 10, end: 20 }
            }
        };
        const inner = {
            context: {
                line: { start: 16, end: 23 }
            }
        };

        expect(isInside(outer, inner)).to.be.false;
    });
})
describe("parser helpers: isEmptyObject", () => {
    it("should return true for undefined", () => {
        expect(isEmptyObject(undefined)).to.be.true; // eslint-disable-line unicorn/no-useless-undefined
    });
    
    it("should return true for empty object", () => {
        expect(isEmptyObject({})).to.be.true;
    });

    it("should return true when there are no valuable propertios in object", () => {
        const input = {
            prop3: 0,
            prop4: "",
            prop1: null,
            prop2: undefined
        }

        expect(isEmptyObject(input)).to.be.true;
    });
})
