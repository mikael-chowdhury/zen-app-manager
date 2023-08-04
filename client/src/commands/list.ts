import { Command, ListCommandOptions, PackageInformation } from "../types";
import getRepoPackages from "../util/getRepoPackages";
import getRepos from "../util/getRepos";
import readCache from "../util/readCache";
import ulog from "../util/ulog";
import writeCache from "../util/writeCache";
import Table from "text-table";
import stripColour from "strip-color";
import fs from "fs";
import consts from "../consts";
import path from "path";
import colors from "colors";
import cla from "command-line-args";

export default {
  trigger: "list",
  alias: "l",
  usage: "zen list[l] {--repo[-r]}",
  async run(argv) {
    const options: ListCommandOptions = cla(
      [
        {
          name: "repo",
          alias: "r",
          type: Boolean,
        },
        {
          name: "installed",
          alias: "i",
          type: Boolean,
        },
      ],
      { stopAtFirstUnknown: true, argv }
    ) as ListCommandOptions;

    if (options.installed) {
      const installedPackages = fs.readdirSync(consts.packages);
      const repos: { [key: string]: number } = {};
      const packageInfo: PackageInformation[] = installedPackages.map((pkg) => {
        try {
          const parsed: PackageInformation = JSON.parse(
            fs
              .readFileSync(path.join(consts.packages, pkg, "packageInfo.json"))
              .toString()
          );
          repos[parsed.repo as keyof typeof repos] =
            (repos[parsed.repo as keyof typeof repos] || 0) + 1;
          return parsed;
        } catch (error) {
          return {};
        }
      }) as PackageInformation[];

      let t = Table(
        [
          [
            colors.underline(colors.bold("package name")),
            colors.underline(colors.bold("repo")),
          ],
        ].concat(
          packageInfo.map((pkg, i) => [
            colors.bold(colors.green(installedPackages[i])),
            colors.bold(colors.yellow(pkg.repo || "")),
          ]) as unknown as ConcatArray<never>
        ),
        {
          stringLength(str) {
            return stripColour(str).length;
          },
        }
      );

      console.log(t);

      console.log(
        `\n\nFound `.green.bold +
          "" +
          packageInfo.length.toString().red.bold +
          ` installed package/s from a total of `.green.bold +
          Object.keys(repos).length.toString().red.bold +
          ` repo/s`.green.bold
      );
    } else if (!options.repo) {
      const cache = await readCache();

      let packages: string[] = [];
      let repos: string[] = [];
      Object.keys(cache).forEach((repo) => {
        cache[repo].forEach((pkg) => {
          packages.push(pkg);
          repos.push(repo);
        });
      });

      let t = Table(
        [
          [
            colors.underline(colors.bold("package name")),
            colors.underline(colors.bold("repo")),
          ],
        ].concat(
          packages.map((pkg, i) => [
            colors.bold(colors.green(pkg)),
            colors.bold(colors.yellow(repos[i] || "")),
          ]) as unknown as ConcatArray<never>
        ),
        {
          stringLength(str) {
            return stripColour(str).length;
          },
        }
      );

      console.log(t);

      console.log(
        `\n\nFound `.green.bold +
          "" +
          packages.length.toString().red.bold +
          ` package/s from a total of `.green.bold +
          repos.length.toString().red.bold +
          ` repo/s`.green.bold
      );
    } else if (options.repo) {
      const cache = await readCache();
      const repos = Object.keys(cache);
      const listedRepos = getRepos();

      const t = Table(
        [["repo".underline.bold, "packages".underline.bold]].concat(
          repos.map((repo) => [
            repo.green.bold,
            (cache[repo] || []).join(", ").yellow,
          ]) as unknown as ConcatArray<never>
        ),
        {
          stringLength(str) {
            return str.strip.length;
          },
        }
      );

      console.log(t);

      const totalPackages = repos
        .map((repo) => cache[repo].length)
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);

      console.log(
        `\n\nFound `.green.bold +
          "" +
          repos.length.toString().red.bold +
          ` repo/s with a total of `.green.bold +
          totalPackages.toString().red.bold +
          ` installable package/s`.green.bold +
          (listedRepos.length - repos.length > 0
            ? `\n\nFound ${
                listedRepos.length - repos.length
              } unupdated repo/s\nrun 'sudo zen update' to update repo cache`
                .yellow.bold
            : "")
      );
    }
  },
} as Command;
