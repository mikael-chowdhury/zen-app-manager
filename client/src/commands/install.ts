import consts from "../consts";
import InstallPackage from "../handlers/packages/InstallPackage";
import { Command, InstallCommandOptions } from "../types";
import cla from "command-line-args";
import fs from "fs";

const object = {
  trigger: "install",
  alias: "i",
  usage: "sudo zen install[i] <package-name>",
  run: async (argv: string[]) => {
    if (!!process.env.SUDO_UID) {
      const options: InstallCommandOptions = cla(
        [
          {
            name: "packageNames",
            defaultOption: true,
            multiple: true,
          },
        ],
        { stopAtFirstUnknown: true, argv }
      ) as InstallCommandOptions;

      const packageNames = options.packageNames || [];

      if (packageNames.length > 0) {
        let packageIndex = 0;

        while (packageIndex < packageNames.length) {
          await InstallPackage(packageNames[packageIndex]);
          packageIndex++;
        }
      } else {
        console.log(`\nUsage: ${object.usage}`);
      }

      console.log();
    } else {
      console.error(
        "\nInstalling/adding packages requires sudo/root\n".red.bold
      );
    }
  },
} as Command;

export default object;
