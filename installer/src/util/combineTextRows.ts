export default (space: number, ...letters: string[][]): string[] => {
  let final: string[] = [];

  let rownum = 0;
  while (rownum < letters[0].length) {
    let row: string = "";
    letters.forEach((letter) => {
      row += letter[rownum] + " ".repeat(space);
    });

    final.push(row);
    rownum++;
  }

  return final;
};
