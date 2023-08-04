import table from "text-table";
import { Command, SearchCommandOptions } from "../types";
import getRepoPackages from "../util/getRepoPackages";
import getRepos from "../util/getRepos";
import readCache from "../util/readCache";
import ulog from "../util/ulog";
import writeCache from "../util/writeCache";
import cla from "command-line-args";
import colors from "colors";
import stripColor from "strip-color";

const object = {
  trigger: "search",
  alias: "s",
  usage: "zen search[s] <search-term>",
  async run(argv) {
    const options: SearchCommandOptions = cla(
      [
        {
          name: "searchTerm",
          defaultOption: true,
        },
      ],
      { stopAtFirstUnknown: true, argv }
    ) as SearchCommandOptions;

    const cache = await readCache();

    const searchTerm = options.searchTerm || "";

    if (searchTerm.trim() != "") {
      const searchPossibilities: { packageName: string; repo: string }[] = [];

      Object.keys(cache).forEach((repo) => {
        const packages = cache[repo];

        const packagesThatMeetSearchReq = packages.filter((pkg) =>
          pkg.includes(searchTerm)
        );

        packagesThatMeetSearchReq.forEach((packageName) => {
          let packageNameFormatted = "";

          let searchTermStartIndex = packageName.indexOf(searchTerm);
          let searchTermEndIndex = searchTermStartIndex + searchTerm.length;

          for (let i = 0; i < packageName.length; i++) {
            if (i >= searchTermStartIndex && i < searchTermEndIndex) {
              packageNameFormatted += packageName[i].green.bold;
            } else {
              packageNameFormatted += packageName[i].red;
            }
          }

          searchPossibilities.push({
            packageName: packageNameFormatted,
            repo: repo.yellow,
          });
        });
      });

      const t = table(
        [["package name".underline.bold, "repo".underline.bold]].concat(
          searchPossibilities.map((possibility) => [
            possibility.packageName,
            possibility.repo,
          ]) as unknown as ConcatArray<never>
        ),
        {
          stringLength(str) {
            return stripColor(str).length;
          },
        }
      );

      console.log(t);

      let exactResults = searchPossibilities.filter(
        (possibility) => possibility.packageName.strip === searchTerm
      ).length;
      let similarResults = searchPossibilities.length - exactResults;

      console.log(
        `\n\nSearch found ${searchPossibilities.length} results (${exactResults} exact, ${similarResults} similar)`
          .green.bold
      );
    } else {
      console.log(`\nUsage: ${object.usage}\n`);
    }
  },
} as Command;

export default object;
