import "mocha";
import { expect } from "@oclif/test";
import parse from "../../../../src/workers/parse/contextParsers/less.context.parser";

describe("LESS context parser", () => {
   
    it("should parse variable with no value", () => {
        const input = `@example;`;
        
        const context = parse(input, () => 1);
        
        expect(context.type).to.be.eq("variable");
        expect(context.name).to.be.eq("example");
        expect(context.params).to.be.undefined;
    }); 

    it("should parse class with parenthesis as mixin", () => {
        const input = `.example() {\n color:red;\n}`;
        
        const context = parse(input, () => 1);
        
        expect(context.type).to.be.eq("mixin");
        expect(context.name).to.be.eq(".example");
    }); 
   
    it("should parse simple class as css", () => {
        const input = `.example {\n color:red;\n}`;
        
        const context = parse(input, () => 1);
        
        expect(context.type).to.be.eq("css");
        expect(context.name).to.be.eq(".example");
    }); 

    it("should set expected context.type when parsing documenation for CSS variables", () => {
        const input = `\n--example: red;\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("cssvar");
        expect(context.name).to.be.eq("example");
    });
})