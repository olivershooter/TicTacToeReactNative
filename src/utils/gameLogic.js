export const getWinner = (winnerMap) => {
  // Check rows
  for (let i = 0; i < 3; i++) {
    const isRowXWinning = winnerMap[i].every((cell) => cell === "X");
    const isRowOWinning = winnerMap[i].every((cell) => cell === "O");

    if (isRowXWinning) {
      return "X";
    }
    if (isRowOWinning) {
      return "O";
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    let isColumnXWinner = true;
    let isColumnOWinner = true;

    for (let row = 0; row < 3; row++) {
      if (winnerMap[row][col] !== "X") {
        isColumnXWinner = false;
      }
      if (winnerMap[row][col] !== "O") {
        isColumnOWinner = false;
      }
    }

    if (isColumnXWinner) {
      return "X";
    }
    if (isColumnOWinner) {
      return "O";
    }
  }

  // check diagonals
  let isDiagonal1OWinning = true;
  let isDiagonal1XWinning = true;
  let isDiagonal2OWinning = true;
  let isDiagonal2XWinning = true;
  for (let i = 0; i < 3; i++) {
    if (winnerMap[i][i] !== "O") {
      isDiagonal1OWinning = false;
    }
    if (winnerMap[i][i] !== "X") {
      isDiagonal1XWinning = false;
    }

    if (winnerMap[i][2 - i] !== "O") {
      isDiagonal2OWinning = false;
    }
    if (winnerMap[i][2 - i] !== "X") {
      isDiagonal2XWinning = false;
    }
  }

  if (isDiagonal1OWinning || isDiagonal2OWinning) {
    return "O";
  }
  if (isDiagonal1XWinning || isDiagonal2XWinning) {
    return "X";
  }
};

//Essentially no cell in a row should be empty nor should a row have an empty string cell
//Then it's a tie
export const isTie = (map) => {
  return !map.some((row) => row.some((cell) => cell === ""));
};
