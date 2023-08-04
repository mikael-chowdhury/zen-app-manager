import path from "path";
import consts from "../consts";
import InstallPackage from "../handlers/packages/InstallPackage";
import {
  Command,
  InstallCommandOptions,
  RepoCommandOptions,
  RepoModifyCommandOptions,
} from "../types";
import cla from "command-line-args";
import fs from "fs";
import getRepos from "../util/getRepos";

const object = {
  trigger: "repo",
  alias: "r",
  usage: "sudo zen repo[r] <add|remove> <repo-url>",
  run: async (argv: string[]) => {
    const options: RepoCommandOptions = cla(
      [
        {
          name: "command",
          defaultOption: true,
        },
      ],
      { stopAtFirstUnknown: true, argv }
    ) as RepoCommandOptions;

    if (!!process.env.SUDO_UID) {
      if (options.command == "add") {
        const addOptions: RepoModifyCommandOptions = cla(
          [
            {
              name: "repos",
              defaultOption: true,
              multiple: true,
            },
          ],
          { argv: options._unknown }
        ) as unknown as RepoModifyCommandOptions;

        const reposInList = getRepos();
        let added = 0;
        addOptions.repos.forEach((repo, i) => {
          if (!reposInList.includes(repo)) {
            fs.appendFileSync(path.join(consts.repo), repo + "\n");
            added++;
          } else {
            console.log(`repo ${repo} already exists in list`.red.bold);
          }

          if (i == addOptions.repos.length - 1) {
            console.log(
              `\nSuccessfully added ${added} repos to list\n`.green.bold
            );
          }
        });
      } else if (options.command == "remove") {
        const removeOptions: RepoModifyCommandOptions = cla(
          [
            {
              name: "repos",
              defaultOption: true,
              multiple: true,
            },
          ],
          { argv: options._unknown }
        ) as unknown as RepoModifyCommandOptions;

        const reposInList = getRepos();

        let newList = "";
        let reposToRemove: string[] = [];

        removeOptions.repos.forEach((repo) => {
          if (reposInList.includes(repo)) {
            reposToRemove.push(repo);
          } else {
            console.log(`repo ${repo} doesn't exist in list`.red.bold);
          }
        });

        if (reposToRemove.length > 0) {
          reposInList.forEach((repo) => {
            if (!reposToRemove.includes(repo)) {
              newList += repo + "\n";
            }
          });

          fs.writeFileSync(consts.repo, newList);

          console.log(
            `\nSuccessfully removed ${reposToRemove.length} repos from list\n`
              .green.bold
          );
        } else {
          console.log(`\nno repos to remove.\n`.red.bold);
        }
      } else {
        if ((options.command || "").trim() == "") {
          console.log(`\nUsage: ${object.usage}\n`);
        } else {
          console.log(`\nUnknown subcommand '${options.command}'\n`.red.bold);
        }
      }
    } else {
      console.error("\nManaging repos requires sudo/root\n".red.bold);
    }
  },
} as Command;

export default object;
