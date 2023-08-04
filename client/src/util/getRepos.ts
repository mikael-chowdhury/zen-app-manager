import fs from "fs";
import consts from "../consts";

export default (): string[] => {
  if (fs.existsSync(consts.repo)) {
    return (fs
      .readFileSync(consts.repo)
      .toString()
      .match(/[^\r\n]+/g) || []) as string[];
  } else return [];
};
