import path from "path";

const appDir = path.join(
  (process.env.APPDATA as string) ||
    path.join(process.env.HOME as string, "/Library"),
  ".zen"
);

export default {
  repo: path.join(appDir, "repos"),
  cache: path.join(appDir, "repocache"),
  installTemp: path.join(appDir, "downloadtempcache"),
  packages: path.join(appDir, "packages"),
};
