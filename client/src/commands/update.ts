import { Command, UpdateCommandOptions } from "../types";
import getRepoPackages from "../util/getRepoPackages";
import getRepos from "../util/getRepos";
import readCache from "../util/readCache";
import ulog from "../util/ulog";
import writeCache from "../util/writeCache";
import cla from "command-line-args";
import clearcache from "./clearcache";
import { writeFileSync } from "fs";
import consts from "../consts";

export default {
  trigger: "update",
  alias: "u",
  usage: "sudo zen update",
  async run(argv) {
    if (!!process.env.SUDO_UID) {
      const options: UpdateCommandOptions = cla(
        [
          {
            name: "force",
            alias: "f",
            type: Boolean,
          },
        ],
        { stopAtFirstUnknown: true, argv }
      ) as UpdateCommandOptions;

      if (options.force) {
        writeFileSync(consts.cache, "");
        writeFileSync(consts.installTemp, "");

        ulog("successfully cleared repo and install cache".green.bold + "");
      }

      ulog("detecting new repos...", 0, true);

      const repos = getRepos();
      const cache = await readCache();

      const uncachedRepos = repos.filter((repo) => !cache[repo]);

      if (uncachedRepos.length > 0) {
        ulog(
          `found ${uncachedRepos?.length} uncached repos. Beginning update...`
            .yellow.bold + ""
        );

        let updateIndex = 0;

        while (updateIndex < uncachedRepos.length) {
          const repo = uncachedRepos[updateIndex];
          ulog(
            `updating repo #${updateIndex}     ${repo}`.yellow.bold + "",
            1,
            true
          );

          const repoPackages = await getRepoPackages(repo);

          ulog(`updated repo #${updateIndex}     ${repo}`.green.bold + "\n", 1);

          cache[repo] = repoPackages;

          updateIndex++;
        }

        await writeCache(cache);
      } else {
        ulog("no repos require updating into cache");
      }
    } else
      console.error("\n\nUpdating repo cache requires sudo/root\n".red.bold);
  },
} as Command;
