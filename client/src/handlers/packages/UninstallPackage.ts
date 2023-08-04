import fs from "fs";
import consts from "../../consts";
import path from "path";
import colors from "colors";
import ulog from "../../util/ulog";

export default (packageName: string) => {
  try {
    fs.rmSync(path.join(consts.packages, packageName), {
      recursive: true,
      force: true,
    });
    ulog(
      colors.green(`\nsuccessfully uninstalled package: ${packageName}\n`)
        .bold + ""
    );
  } catch (error) {
    console.error(
      colors.red(`\nerror uninstalling package: ${packageName}\n`).bold
    );
    console.log(error);
  }
};
