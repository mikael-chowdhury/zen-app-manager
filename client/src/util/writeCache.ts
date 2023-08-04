import fs from "fs";
import consts from "../consts";

export default (cacheObject: { [key: string]: string[] }) => {
  let newCacheText = "";

  Object.keys(cacheObject).forEach((cacheItem, index) => {
    newCacheText += `${cacheItem} [${cacheObject[cacheItem]
      .map((item) => `"${item}"`)
      .join(",")}]\n`;

    if (index == Object.keys(cacheObject).length - 1) {
      fs.writeFileSync(consts.cache, newCacheText);
    }
  });
};
