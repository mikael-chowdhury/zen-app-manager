const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");

// const chars = "abcdefghijklmnopqrstuvwxyz1234567890";

// for (let i = 0; i < 10; i++) {
//   let str = "";
//   for (let _ = 0; _ < 1e7; _++) {
//     str += chars[Math.floor(Math.random() * chars.length)].repeat(10);
//   }
//   fs.appendFileSync("./text2.txt", str);

//   console.log(`finished ${i + 1}/10`);
// }

app.get("/repo/getpackages", (req, res) => {
  res.send(
    fs
      .readdirSync(path.join(__dirname, "packages"))
      .map((file) => file.substring(0, file.length - 7))
  );
});

app.get("/repo/package/:packageName", (req, res) => {
  res.sendFile(path.resolve(`./packages/${req.params.packageName}.tar.gz`));
});

app.get("/exec/:execName", (req, res) => {
  const resolvedPath = path.resolve(`./bin/${req.params.execName}`);

  console.log(path.dirname(resolvedPath));

  if (path.dirname(resolvedPath) == path.resolve("./bin")) {
    res.sendFile(resolvedPath);
  } else {
    res.send({ message: "potentially malicious file path!" });
  }
});

app.listen(80);
