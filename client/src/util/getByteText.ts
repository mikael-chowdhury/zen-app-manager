import colors from "colors";

export default (bytes: number, decimals = 2) => {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    colors.bold(
      colors.blue(`${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}`)
    ) + colors.cyan(`${sizes[i]}`).bold
  );
};
