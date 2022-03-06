export const emptyBoardMap = [
  ["", "", ""], //1st Row
  ["", "", ""], //2nd Row
  ["", "", ""], //3rd Row
];

export const boardMapCopy = (original) => {
  const copy = original.map((arr) => {
    return arr.slice();
  });
  return copy;
};
