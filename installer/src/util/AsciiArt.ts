import colors from "colors";
import { readFileSync } from "fs";
import path from "path";

const ReadArtFile = (name: string): string[] =>
  readFileSync(path.join(__dirname, "..", "art", name))
    .toString()
    .split(/\r?\n/);

export const ColorLetter = (letter: string[], color: (str: string) => string) =>
  letter.map((row) => color(row));

export const Z = () => ReadArtFile("Z");
export const E = () => ReadArtFile("E");
export const N = () => ReadArtFile("N");
