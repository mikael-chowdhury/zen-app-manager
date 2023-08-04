import path from "path";
import consts from "../../consts";
import { Command } from "../../types";
import fs from "fs";
import clearcache from "../../commands/clearcache";
import install from "../../commands/install";
import list from "../../commands/list";
import search from "../../commands/search";
import uninstall from "../../commands/uninstall";
import update from "../../commands/update";
import repo from "../../commands/repo";
import help from "../../commands/help";

export default (): Promise<Command[]> => {
  return new Promise((res, rej) => {
    let commands: Command[] = [];

    commands.push(clearcache);
    commands.push(install);
    commands.push(list);
    commands.push(search);
    commands.push(uninstall);
    commands.push(update);
    commands.push(repo);
    commands.push(help);

    // const commandFiles = fs
    //   .readdirSync(consts.commandDir)
    //   .filter((x) => x.endsWith(".ts"));

    // commandFiles.forEach((commandFile, index) => {
    //   import(path.join(consts.commandDir, commandFile)).then(
    //     (command: { default: Command }) => {
    //       commands.push(command.default);

    //       if (commands.length == commandFiles.length) {
    //         res(commands);
    //       }
    //     }
    //   );
    // });

    res(commands);
  });
};
