import path from "path";

let appDir = "";

if (process.platform == "win32") {
  appDir = path.join(process.env.APPDATA as string, ".zen");
} else if (process.platform == "darwin") {
  appDir = path.join(process.env.HOME as string, "/Library", ".zen");
} else if (process.platform == "linux") {
  appDir = path.join("/var/lib", ".zen");
}

export default {
  appDir,
  repo: path.join(appDir, "repos"),
  cache: path.join(appDir, "repocache"),
  installTemp: path.join(appDir, "downloadtempcache"),
  packages: path.join(appDir, "packages"),
};
