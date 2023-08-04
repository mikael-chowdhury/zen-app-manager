import colors from "colors";
import { existsSync, readFileSync } from "fs";
import path from "path";

const artDir = existsSync(path.join(__dirname, "..", "art"))
  ? path.join(__dirname, "..", "art")
  : path.join(__dirname, "..", "..", "art");

const ReadArtFile = (name: string): string[] =>
  readFileSync(path.join(artDir, name)).toString().split(/\r?\n/);

export const ColorLetter = (letter: string[], color: (str: string) => string) =>
  letter.map((row) => color(row));

export const Z = () => ReadArtFile("Z");
export const E = () => ReadArtFile("E");
export const N = () => ReadArtFile("N");
export const H = () => ReadArtFile("H");
export const L = () => ReadArtFile("L");
export const P = () => ReadArtFile("P");
