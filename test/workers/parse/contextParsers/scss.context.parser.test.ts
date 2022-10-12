import "mocha";
import { expect } from "chai";
import parse from "../../../../src/workers/parse/contextParsers/scss.context.parser";

describe("SCSS context parser", () => {

    it("should parse mixin name", () => {
        const input = `\n@mixin example {\n}\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("mixin");
        expect(context.name).to.be.eq("example");
    });

    it("should parse function name", () => {
        const input = `\n@function example {\n}\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("function");
        expect(context.name).to.be.eq("example");
        expect(context.params?.arguments).to.be.undefined;
    });

    it("should parse function with arguments", () => {
        const input = `\n@function example($param1: 10, $param2: 10) {\n}\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("function");
        expect(context.name).to.be.eq("example");
        expect(context.params?.arguments).to.be.eq("$param1: 10, $param2: 10");
    });
   
    it("should parse variable singleline", () => {
        const input = `$example-variable: 123;`;
        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("variable");
        expect(context.name).to.be.eq("example-variable");
        expect(context.value).to.be.eq("123");
    });
  
    it("should parse variable value without semicolon ending", () => {
        const input = `$example-variable: 123`;
        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("variable");
        expect(context.name).to.be.eq("example-variable");
        expect(context.value).to.be.eq("123");
    });
   
    it("should parse variable multiline", () => {
        const expected = 
        `(
            "value1": #111,
            "value2": #222
        )`;
        const input = `$example-variable: ${expected};`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("variable");
        expect(context.name).to.be.eq("example-variable");
        expect(context.value).to.be.eq(expected);
    });

    it("should parse unknown mixin-like element as type 'others'", () => {
        const input = `\n@somemethod example {\n}\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("others");
        expect(context.name).to.be.eq("example");
    });
    
    it("should parse unknown function-like element as type 'others'", () => {
        const input = `\n@somemethod example($color, $amount: 100%) {\n}\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("others");
        expect(context.name).to.be.eq("example");
        expect(context.params?.arguments).to.be.eq("$color, $amount: 100%");
    });
    
    it("should parse simple @use as expected", () => {
        const input = `\n@use "src/testing.scss";\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("use");
        expect(context.name).to.be.eq("testing");
        expect(context.params.quoteData).to.be.eq("src/testing.scss");
    });
    
    it("should parse simple @use as expected", () => {
        const input = `\n@use "some/test_namespace";\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("use");
        expect(context.name).to.be.eq("test_namespace");
        expect(context.params.quoteData).to.be.eq("some/test_namespace");
    });
    
    it("should set context.name to be equal namespace of @use", () => {
        const input = `\n@use "src/testing.scss" as test_namespace;\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("use");
        expect(context.name).to.be.eq("test_namespace");
        expect(context.params.quoteData).to.be.eq("src/testing.scss");
    });

    it("should set expected context.type when parsing documenation for CSS variables", () => {
        const input = `\n   --example: red;\n`;

        const context = parse(input, () => 1);

        expect(context.type).to.be.eq("cssvar");
        expect(context.name).to.be.eq("example");
    });
})