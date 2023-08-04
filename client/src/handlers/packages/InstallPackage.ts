import fs from "fs";
import consts from "../../consts";
import ulog from "../../util/ulog";
import readCache from "../../util/readCache";
import getRepos from "../../util/getRepos";
import inquirer from "inquirer";
import axios from "axios";
import joinURL from "../../util/joinURL";
import http from "http";
import path from "path";
import tar from "tar-stream";
import zlib from "zlib";
import colors from "colors";
import getByteText from "../../util/getByteText";
import { PackageInformation } from "../../types";

export default async (packageName: string): Promise<void> => {
  return new Promise(async (finishedInstallation, rej) => {
    const installedPackages = fs.readdirSync(consts.packages);
    if (installedPackages.includes(packageName)) {
      console.error(
        colors.red(
          `Already installed package '` +
            colors.bold(packageName) +
            `'! Cancelling installation`
        ).bold
      );

      try {
        const packageInformation: PackageInformation = JSON.parse(
          fs
            .readFileSync(
              path.join(consts.packages, packageName, "packageInfo.json")
            )
            .toString()
        );
        ulog(`package repo: ${packageInformation.repo}`, 1);
      } catch (error) {
        ulog(
          `couldn't obtain package information (corrupt or non-existent information file)`,
          1
        );
      }
      finishedInstallation();
    } else {
      const startTime = Date.now();

      ulog(colors.bold(colors.cyan(`\ninstalling package ${packageName}...`)));
      ulog(colors.yellow("finding package repo..."), 1, true);

      const cache = await readCache();
      const repos = Object.keys(cache);

      const reposWithPackage = repos.filter((repo) =>
        cache[repo].includes(packageName)
      );

      if (reposWithPackage.length > 1) {
        console.log(
          `found ${
            reposWithPackage.length
          } repos containing the same package name. Please select which package you wish to install:\n\n${reposWithPackage.map(
            (repo, i) => `|${i + 1}| ${repo}`
          )}`
        );

        inquirer
          .prompt([
            {
              name: "repo index",
              choices: reposWithPackage.map((_, i) => `${i + 1}`),
            },
          ])
          .then((response) => {
            const index = response["repo index"];
            const repo = reposWithPackage[index - 1];

            if (repo) {
              installPackageLoc(repo);
            } else {
              console.error(
                colors.red(
                  "\n\ninvalid repo index provided, cancelling installation."
                )
              );
            }
          });
      } else if (reposWithPackage.length == 1) {
        installPackageLoc(reposWithPackage[0]);
      } else if (reposWithPackage.length == 0) {
        console.error(
          colors.red(
            `\n\nCouldn't find any cached repos containing a package named ${packageName}`
          )
        );
      }

      function installPackageLoc(repo: string) {
        let chunks: Buffer[] = [];
        const url = joinURL(repo, "package", packageName);
        http.get(url, (res) => {
          const writeStream = fs.createWriteStream(consts.installTemp);

          ulog(colors.bold(colors.green(`received package from ${url}`)), 1);
          ulog("installing package...  0B".yellow.bold + "", 2, true);
          res.on("data", (chunk: any) => {
            chunks.push(chunk);
            if (chunks.length % 500 == 0) {
              ulog(
                colors.yellow(`installing package...`).bold +
                  `   ${getByteText(Buffer.concat(chunks).byteLength)}`,
                2,
                true
              );
            }
            writeStream.write(chunk);
          });

          res.on("error", (err) => {
            console.error(err);
          });

          res.on("close", () => {
            ulog(
              colors.bold(
                colors.green(
                  `installed package.   ${getByteText(
                    Buffer.concat(chunks).byteLength
                  )}`
                )
              ),
              2
            );
            writeStream.close();

            fs.mkdirSync(path.join(consts.packages, packageName), {
              recursive: true,
            });

            const extract = tar.extract();

            let totalExtractedChunks: Buffer[] = [];
            extract.on("entry", (headers, stream, next) => {
              let chunks: Buffer[] = [];
              ulog(
                colors.yellow(`extracting ${path.basename(headers.name)} `)
                  .bold + getByteText(0),
                2,
                true
              );
              stream.on("data", (data) => {
                chunks.push(data);
                totalExtractedChunks.push(data);

                if (chunks.length % 500 == 0) {
                  ulog(
                    colors.yellow(`extracting package contents...`).bold +
                      ` ${getByteText(
                        Buffer.concat(totalExtractedChunks).byteLength
                      )}`,
                    1,
                    true
                  );
                }
              });

              stream.on("end", () => {
                fs.mkdirSync(
                  path.join(
                    consts.packages,
                    packageName,
                    headers.name.substring(0, headers.name.lastIndexOf("/"))
                  ),
                  { recursive: true }
                );
                fs.writeFileSync(
                  path.join(consts.packages, packageName, headers.name),
                  Buffer.concat(chunks)
                );
                next();
              });
            });

            extract.on("finish", () => {
              fs.promises.writeFile(
                path.join(consts.packages, packageName, "packageInfo.json"),
                JSON.stringify({ repo })
              );

              ulog(
                colors.green(`extracted package contents...`).bold +
                  ` ${getByteText(
                    Buffer.concat(totalExtractedChunks).byteLength
                  )}`,
                1,
                true
              );

              console.log(
                colors.bold(
                  colors.green(
                    `\n\nSuccessfully installed package ${packageName} (${
                      Date.now() - startTime
                    }ms)\n\n`
                  ).bold + ""
                )
              );
              finishedInstallation();
            });

            ulog(
              colors.yellow("extracting package contents...").bold + "",
              1,
              true
            );
            fs.createReadStream(consts.installTemp)
              .pipe(zlib.createGunzip())
              .pipe(extract);
          });
        });
      }
    }
  });
};
