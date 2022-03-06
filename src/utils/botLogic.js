import { boardMapCopy } from "./index";
import { getWinner } from "./gameLogic";

export const botTurn = (boardMap, gameMode) => {
  //Look at all the possible options
  const possiblePositions = [];
  boardMap.forEach((row, rowIndex) => {
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
      const copyMapArray = boardMapCopy(boardMap);
      copyMapArray[possiblePosition.row][possiblePosition.col] = "o";

      const winner = getWinner(copyMapArray);
      if (winner === "o") {
        botChoosesOption = possiblePosition;
      }
    });

    if (!botChoosesOption) {
      //Defending turn
      //Double check if the opponent has a winning move
      possiblePositions.forEach((possiblePosition) => {
        const copyMapArray = boardMapCopy(boardMap);

        copyMapArray[possiblePosition.row][possiblePosition.col] = "x";

        const winner = getWinner(copyMapArray);
        if (winner === "x") {
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
