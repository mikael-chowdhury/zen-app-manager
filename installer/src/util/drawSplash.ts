import { Z, ColorLetter, E, N } from "./AsciiArt";
import colors from "colors";
import combineTextRows from "./combineTextRows";

export default (
  leftPadding: number,
  topPadding: number,
  bottomPadding: number
) => {
  console.clear();
  console.log(
    "\n".repeat(topPadding) +
      " ".repeat(leftPadding) +
      "welcome to".cyan +
      "\n\n\n" +
      combineTextRows(
        3,
        ColorLetter(Z(), colors.red.bold),
        ColorLetter(E(), colors.green.bold),
        ColorLetter(N(), colors.cyan.bold)
      )
        .map((row) => " ".repeat(leftPadding) + row)
        .join("\n")
  );
  console.log("\n".repeat(bottomPadding));
};
