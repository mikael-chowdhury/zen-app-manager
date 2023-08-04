import consts from "../consts";
import fs from "fs";

export default (): Promise<{ [key: string]: string[] }> => {
  return new Promise((res, rej) => {
    let cacheObject: { [key: string]: string[] } = {};

    if (fs.existsSync(consts.cache)) {
      const data = fs.readFileSync(consts.cache).toString();

      const splitLines = data.match(/[^\r\n]+/g) || [];

      splitLines?.forEach((line, index) => {
        const format = line.split(/ /g);

        try {
          const pkgName = format[0];
          const packages = eval(format[1]) as string[];

          cacheObject[pkgName] = packages;
        } catch (error) {
          console.error("\n\nERROR: Currupt cache file");
        }

        if (index == splitLines.length - 1) {
          res(cacheObject);
        }
      });

      if (splitLines?.length == 0) {
        res({});
      }
    } else res({});
  });
};
