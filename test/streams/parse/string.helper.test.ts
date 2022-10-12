import "mocha";
import { expect } from "chai";
import { getFileExtension, containsAnnotation, trimSmart } from "../../../src/helpers/string.helper";

describe("string helper: trimSpaceIdentation", () => {
    it("should trim identation of a code block", () => {
        const input = [
            "   .foo {",
            "      @include font-size(1.2);",
            "   }"
        ].join("\n");
        
        const result = trimSmart(input);

        const lines = result.split("\n");
        expect(lines).to.deep.eq([
            ".foo {",
            "   @include font-size(1.2);",
            "}"
        ]);
    });
   
    it("should trim identation of a single line", () => {
        expect(trimSmart("   input")).to.eq("input");
        expect([trimSmart("   input")]).to.deep.eq(["input"]);
    })
    
    it("should trim identation of a code block presented as array of strings", () => {
        const input = [
            "   .foo {",
            "      font-size: 1;",
            "   }"
        ];
        
        const result = trimSmart(input);

        expect(result).to.deep.eq([
            ".foo {",
            "   font-size: 1;",
            "}"
        ]);
    })
});

describe("string helper: getFileExtension", () => {
    it("should extract file extension", () => {
        const input = "file.less";
        
        const result = getFileExtension(input);

        expect(result).to.be.eq("less");
    })
});

describe("string helper: containsAnnotation", () => {
    it("should return true for strings containing annotation", () => {
        const input = [
            "non-annotation",
            "     prefixed-non-annotation",
            "@annotation",
            "     @prefixedWithSpaces",
            "       @prefixedWithTabs",
        ];
        
        const result = input.map(x => containsAnnotation(x));

        expect(result).to.be.deep.eq([false, false, true, true, true]);
    })
});