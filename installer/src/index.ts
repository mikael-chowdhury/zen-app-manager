#!/usr/bin/env node
import colors from "colors";
import drawSplash from "./util/drawSplash";
import ulog from "./util/ulog";
import fs from "fs";
import consts from "./consts";
import http from "http";
import path from "path";

if (!!process.env.SUDO_UID) {
  fs.rmSync(consts.appDir, { recursive: true, force: true });

  const leftPadding = 10;
  const topPadding = 2;

  drawSplash(leftPadding, topPadding, 1);

  console.log(
    " ".repeat(leftPadding) +
      "press any key to continue the installation\n\n".cyan
  );

  process.stdin.setRawMode(true);

  process.stdin.on("data", () => {
    process.stdin.removeAllListeners();
    process.stdin.setRawMode(false);

    console.clear();
    console.log("\n".repeat(3));

    try {
      let progress = 0;
      let totalSteps = 5;

      progress++;
      ulog(
        `(${progress}/${totalSteps}) `.cyan +
          "creating app data directory".yellow,
        1,
        true
      );
      fs.mkdirSync(consts.appDir, { recursive: true });
      ulog(
        `(${progress}/${totalSteps}) `.cyan +
          "created app data directory".green.bold +
          "",
        1,
        false
      );

      progress++;
      ulog(
        `(${progress}/${totalSteps}) `.cyan +
          "creating package storage directory".yellow,
        1,
        true
      );
      fs.mkdirSync(consts.packages, { recursive: true });
      ulog(
        `(${progress}/${totalSteps}) `.cyan +
          "created package storage directory".green.bold +
          "",
        1,
        false
      );

      progress++;
      ulog(
        `(${progress}/${totalSteps}) `.cyan + "creating repo list".yellow,
        1,
        true
      );
      fs.writeFileSync(consts.repo, "");
      ulog(
        `(${progress}/${totalSteps}) `.cyan +
          "created repo list".green.bold +
          "",
        1,
        false
      );

      progress++;
      ulog(
        `(${progress}/${totalSteps}) `.cyan + "retrieving executable".yellow,
        1,
        true
      );

      const execName = "zen" + (process.platform == "win32" ? ".exe" : "");
      const binName =
        "zen-" +
        (process.platform == "linux"
          ? "linux"
          : process.platform == "darwin"
          ? "macos"
          : "win.exe");

      let filePath = "";

      if (process.platform == "darwin") {
        filePath = "/usr/local/bin";
      } else if (process.platform == "linux") {
        filePath = "/usr/bin";
      } else if (process.platform == "win32") {
        filePath = path.join(process.env.ProgramFiles as string, "zen");
        try {
          fs.mkdirSync(filePath, { recursive: true });
        } catch {}
      }

      const file = fs.createWriteStream(path.join(filePath, execName));

      const request = http.get(
        `http://localhost:80/exec/${binName}`,
        function (response) {
          response.pipe(file);

          // after download completed close filestream
          file.on("finish", () => {
            file.close();
            ulog(
              `(${progress}/${totalSteps}) `.cyan +
                "retrieved executable".green.bold +
                "",
              1,
              false
            );

            progress++;
            ulog(
              `(${progress}/${totalSteps}) `.cyan +
                "fixing permissions for executable".yellow,
              1,
              true
            );

            if (process.platform == "linux" || process.platform == "darwin") {
              fs.chownSync(
                path.join(filePath, execName),
                parseInt(process.env.SUDO_UID as string),
                parseInt(process.env.SUDO_GID as string)
              );

              fs.chmodSync(path.join(filePath, execName), 0o755);
            }
            ulog(
              `(${progress}/${totalSteps}) `.cyan +
                "fixed permissions for executable".green.bold +
                "",
              1,
              false
            );

            console.log("\n\n");
            ulog(
              "Sucessfully installed ZEN to ".green.bold +
                "" +
                filePath.cyan.bold,
              1
            );

            console.log("\n");
            ulog(
              "Run ".green.bold +
                "" +
                "zen help".cyan.bold +
                " to learn more".green.bold,
              1
            );
            console.log("\n");

            process.exit();
          });
        }
      );
    } catch (error) {
      console.log(
        "An error occured in the most recent step. Error:\n".red.bold
      );
      console.error(error);
    }
  });
} else {
  console.log("\ninstalling zen requires root/sudo access!\n".red.bold);
}
