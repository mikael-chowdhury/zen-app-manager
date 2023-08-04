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
import combineTextRows from "../util/combineTextRows";
import { ColorLetter, E, H, L, P } from "../util/AsciiArt";
import colors from "colors";

export default {
  trigger: "help",
  alias: "h",
  usage: "zen help[h]",
  async run(argv) {
    const leftPadding = 10;
    const topPadding = 2;
    const bottomPadding = 2;

    console.clear();

    console.log("\n".repeat(topPadding));

    console.log(
      combineTextRows(
        3,
        ColorLetter(H(), colors.red.bold),
        ColorLetter(E(), colors.green.bold),
        ColorLetter(L(), colors.cyan.bold),
        ColorLetter(P(), colors.blue.bold)
      )
        .map((row) => " ".repeat(leftPadding) + row)
        .join("\n")
    );
    console.log("\n".repeat(bottomPadding));

    ulog(
      "everything placed inside ".blue.bold +
        "" +
        "< >".cyan.bold +
        " is meant as a placeholder".blue.bold +
        "",
      3
    );
    ulog(
      "every command with ".blue.bold +
        "" +
        "[SUDO] ".red.bold +
        " referenced is required to be run with sudo".blue.bold,
      3
    );
    ulog(
      "purple text indicates a description for the command written above\n\n"
        .blue.bold + "",
      3
    );

    // REPO //
    ulog("Repos".green.bold + "\n", 3);

    // add repo
    ulog("Add Repo".yellow.bold + "" + " [SUDO]".red.bold + "\n", 4);
    ulog("sudo zen repo add <repo-url>".cyan.bold + "", 5);
    ulog("adds a repo to the repo-list".magenta.bold + "\n", 5);

    // remove repo
    ulog("Remove Repo".yellow.bold + "" + " [SUDO]".red.bold + "\n", 4);
    ulog("sudo zen repo remove <repo-url>".cyan.bold + "", 5);
    ulog("removes a repo to the repo-list".magenta.bold + "\n", 5);

    // update repo cache
    ulog("Update Repo Cache".yellow.bold + "" + " [SUDO]".red.bold + "\n", 4);
    ulog("sudo zen update".cyan.bold + "", 5);
    ulog(
      "loads any unupdated repos into the repocache, where all packages the repo offers is stored"
        .magenta.bold + "\n",
      5
    );

    // clear repo cache
    ulog("Clear Repo Cache".yellow.bold + "" + " [SUDO]".red.bold + "\n", 4);
    ulog("sudo zen clearcache".cyan.bold + "", 5);
    ulog(
      "clears the repocache. The cache must be re-updated before you can download packages again!"
        .magenta.bold + "\n",
      5
    );

    // list repos
    ulog("List Repos".yellow.bold + "\n", 4);
    ulog("zen list --repo[-r]".cyan.bold + "", 5);
    ulog(
      "lists all repos that have been loaded into the cache.".magenta.bold + "",
      5
    );
    ulog(
      "Also displays number of unloaded repos at the bottom".magenta.bold +
        "\n",
      5
    );

    // PACKAGES //
    ulog("Packages".green.bold + "\n", 3);

    // install package
    ulog("Install Package".yellow.bold + "" + " [SUDO]".red.bold + "\n", 4);
    ulog("sudo zen install <package-name>".cyan.bold + "", 5);
    ulog("install package <package-name>".magenta.bold + "\n", 5);

    // uninstall package
    ulog("Uninstall Package".yellow.bold + "" + " [SUDO]".red.bold + "\n", 4);
    ulog("sudo zen uninstall <package-name>".cyan.bold + "", 5);
    ulog("uninstall package <package-name>".magenta.bold + "\n", 5);

    // search for package
    ulog("Searching for packages".yellow.bold + "\n", 4);
    ulog("zen search <search-term>".cyan.bold + "", 5);
    ulog(
      "search through all installable packages from all cached repos.".magenta
        .bold + "",
      5
    );
    ulog("Returns packages that include <search-term>".magenta.bold + "\n", 5);

    // list packages
    ulog("Listing packages".yellow.bold + "\n", 4);
    ulog("zen list".cyan.bold + "", 5);
    ulog("lists all packages".magenta.bold + "\n", 5);

    ulog("zen list -i".cyan.bold + "", 5);
    ulog("lists all installed packages".magenta.bold + "\n", 5);
  },
} as Command;
