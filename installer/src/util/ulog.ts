export default (
  message: string,
  indent: number = 0,
  progress: boolean = false
) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write("   ".repeat(indent) + message + (progress ? "" : "\n"));
};
