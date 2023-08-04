import path from "path";
import UninstallPackage from "../handlers/packages/UninstallPackage";
import {
  Command,
  InstallCommandOptions,
  UninstallCommandOptions,
} from "../types";
import getRepoPackages from "../util/getRepoPackages";
import getRepos from "../util/getRepos";
import readCache from "../util/readCache";
import ulog from "../util/ulog";
import writeCache from "../util/writeCache";
import cla from "command-line-args";
import fs from "fs";
import consts from "../consts";
import colors from "colors";

const object = {
  trigger: "uninstall",
  alias: "uni",
  usage: "sudo zen uninstall[uni] <package-name>",
  async run(argv) {
    if (!!process.env.SUDO_UID) {
      const installedPackages = fs.readdirSync(consts.packages);

      const options: InstallCommandOptions = cla(
        [
          {
            name: "packageNames",
            defaultOption: true,
            multiple: true,
          },
        ],
        { stopAtFirstUnknown: true, argv }
      ) as UninstallCommandOptions;

      const packageNames = options.packageNames || [];

      if (packageNames.length > 0) {
        let packageIndex = 0;

        while (packageIndex < packageNames.length) {
          if (installedPackages.includes(packageNames[packageIndex])) {
            await UninstallPackage(packageNames[packageIndex]);
          } else
            console.error(
              colors.red(
                `package not installed ` +
                  `'${packageNames[packageIndex]}'`.red.bold
              )
            );
          packageIndex++;
        }
      } else {
        console.log(`\nUsage: ${object.usage}\n`);
      }

      console.log();
    } else
      console.error("\nUninstalling/removing packages requires sudo/root\n");
  },
} as Command;

export default object;
