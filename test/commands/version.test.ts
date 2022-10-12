import { expect, test } from "@oclif/test";

describe("version", () => {
  test
    .stdout()
    .command(["version"])
    .it("runs version", (ctx) => {
      expect(ctx.stdout).to.exist;
    });
});
