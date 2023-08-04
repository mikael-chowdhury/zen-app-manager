#!/usr/bin/env node

import process from "process";
import cla from "command-line-args";
import { CommandOptions } from "./types";
import CommandHandler from "./handlers/commands/CommandHandler";

const commandHandler = new CommandHandler();

(async () => {
  await commandHandler.loadCommands();

  const commandOptions: CommandOptions = cla(
    [
      {
        name: "command",
        defaultOption: true,
      },
    ],
    { stopAtFirstUnknown: true }
  ) as CommandOptions;
  const argv = commandOptions._unknown || [];

  let cmd = commandHandler.getCommandByName(commandOptions.command || "");

  if (cmd) {
    console.log();
    cmd.run(argv);
  } else {
    console.log(`\nUnknown command: '${commandOptions.command}'\n`.red.bold);
  }
})();
