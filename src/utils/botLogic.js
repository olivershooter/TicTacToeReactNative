import { boardMapCopy } from "./index";
import { getWinner } from "./gameLogic";

export const botTurn = (map, gameMode) => {
  //Look at all the possible options
  const possiblePositions = [];
  map.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (cell === "") {
        possiblePositions.push({ row: rowIndex, col: columnIndex });
      }
    });
  });

  let botChoosesOption;

  if (gameMode === "BOT_HARD") {
    //Attacking turn
    possiblePositions.forEach((possiblePosition) => {
      const copyMapArray = boardMapCopy(map);
      copyMapArray[possiblePosition.row][possiblePosition.col] = "O";

      const winner = getWinner(copyMapArray);
      if (winner === "O") {
        botChoosesOption = possiblePosition;
      }
    });

    if (!botChoosesOption) {
      //Defending turn
      //Double check if the opponent has a winning move
      possiblePositions.forEach((possiblePosition) => {
        const copyMapArray = boardMapCopy(map);

        copyMapArray[possiblePosition.row][possiblePosition.col] = "X";

        const winner = getWinner(copyMapArray);
        if (winner === "X") {
          botChoosesOption = possiblePosition;
        }
      });
    }
  }

  //Choose random move
  if (!botChoosesOption) {
    botChoosesOption =
      possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
  }

  return botChoosesOption;
};
