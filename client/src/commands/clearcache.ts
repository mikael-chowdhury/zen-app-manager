import consts from "../consts";
import { Command } from "../types";
import fs from "fs";
import ulog from "../util/ulog";
import colors from "colors";

export default {
  trigger: "clearcache",
  alias: "cc",
  usage: "sudo zen clearcache[cc]",
  async run(argv) {
    if (!!process.env.SUDO_UID) {
      fs.writeFileSync(consts.cache, "");
      fs.writeFileSync(consts.installTemp, "");

      ulog(
        "" +
          "successfully cleared repo and install cache. You can update the repo cache with the 'update (u)' command"
            .green.bold
      );
    } else console.error("Updating repo cache requires sudo/root".red);
  },
} as Command;
