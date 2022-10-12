import Command from "../base";

export default class Version extends Command {
  static description = "Package version.";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static args = [{ name: "file" }];

  public async run(): Promise<void> {
    this.log(this.config.userAgent);
  }
}
