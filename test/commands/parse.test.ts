import { expect, test } from "@oclif/test";
import { readFile, rm } from "node:fs/promises";
import { JsonStreamResult } from "../../src/streams/parse/interfaces";
import { parseToJson } from "../testHelpers/test.utils";

describe("parse", () => {
    test
        .stdout()
        .command([
            "parse",
            "test/assets/parse.function.scss",
            "--to-json",
            "--silent",
            "-d",
            "test-output.json",
        ])
        .it("should save data in destination file", (ctx) => {
            return readFile("test-output.json")
                .then((value) => {
                    expect(ctx.stdout).to.be.empty;
                    expect(value).not.be.empty;
                })
                .finally(() => {
                    return rm("test-output.json");
                });
        });


    test
        .stdout()        
        .command(parseToJson("test/assets/parse.function.scss"))
        .it("should cleanup empty descriptions", (ctx) => {
            const jsonResult = JSON.parse(ctx.stdout) as JsonStreamResult;
            const emptyDescriptionItems = jsonResult.slice(4);

            for (const x of emptyDescriptionItems) {
                expect(x.description).to.be.empty;
            }

        });

    test
        .stdout()        
        .command(parseToJson("test/assets/bad.comments.scss"))
        .it("should ignore //-comments", (ctx) => {
            const [func, variable, css] = JSON.parse(ctx.stdout) as JsonStreamResult;

            expect(func.access).to.be.eq("private");
            expect(func.author).to.be.deep.eq(["author1", "author2"]);

            expect(variable.access).to.be.eq("private");
            expect(variable.author).to.be.deep.eq(["author3", "author4"]);

            expect(css.access).to.be.eq("private");
            expect(css.context.type).to.be.eq("css");
            expect(css.context.name).to.be.eq("nav ul");
            expect(css.context.value).to.be.eq("margin: 0;\n  list-style: none; // inline comment should be OK");
        });
});
