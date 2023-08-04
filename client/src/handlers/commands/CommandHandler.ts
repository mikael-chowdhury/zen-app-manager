import { Command } from "../../types";
import CommandLoader from "./CommandLoader";

export default class {
  private commands: Command[] = [];

  constructor() {}

  async loadCommands() {
    this.commands = await CommandLoader();
  }

  getCommandByName(name: string): Command | undefined {
    return this.commands.find(
      (cmd) =>
        cmd.trigger.toLowerCase() == name.toLowerCase() ||
        cmd.alias.toLowerCase() == name.toLowerCase()
    );
  }
}
