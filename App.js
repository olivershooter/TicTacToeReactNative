import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ImageBackground, Alert } from "react-native";
import React, { useState, useEffect } from "react";

//App
import bg from "./assets/bg.jpeg";
import Cell from "./src/components/Cell";

//AWS
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";
import config from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
Amplify.configure(config);

const emptyBoardMap = [
  ["", "", ""], //1st Row
  ["", "", ""], //2nd Row
  ["", "", ""], //3rd Row
];

const boardMapCopy = (original) => {
  const copy = original.map((arr) => {
    return arr.slice();
  });
  return copy;
};

function App() {
  const [boardMap, setMap] = useState(emptyBoardMap);
  const [currentTurn, setCurrentTurn] = useState("x");
  const [gameMode, setGameMode] = useState("BOT_HARD");

  useEffect(() => {
    if (currentTurn === "o" && gameMode != "LOCAL") {
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(boardMap);
    if (winner) {
      gameEnd(winner);
    } else {
      checkTiedState();
    }
  }, [boardMap]);

  const onPress = (rowIndex, columnIndex) => {
    if (boardMap[rowIndex][columnIndex] !== "") {
      Alert.alert("Position already occupied");
      return;
    }

    setMap((existingMap) => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    setCurrentTurn(currentTurn === "x" ? "o" : "x");
  };

  const onLogout = () => {
    Auth.signOut;
  };

  const getWinner = (winnerMap) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = winnerMap[i].every((cell) => cell === "x");
      const isRowOWinning = winnerMap[i].every((cell) => cell === "o");

      if (isRowXWinning) {
        return "x";
      }
      if (isRowOWinning) {
        return "o";
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnOWinner = true;

      for (let row = 0; row < 3; row++) {
        if (winnerMap[row][col] !== "x") {
          isColumnXWinner = false;
        }
        if (winnerMap[row][col] !== "o") {
          isColumnOWinner = false;
        }
      }

      if (isColumnXWinner) {
        return "x";
      }
      if (isColumnOWinner) {
        return "o";
      }
    }

    // check diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;
    for (let i = 0; i < 3; i++) {
      if (winnerMap[i][i] !== "o") {
        isDiagonal1OWinning = false;
      }
      if (winnerMap[i][i] !== "x") {
        isDiagonal1XWinning = false;
      }

      if (winnerMap[i][2 - i] !== "o") {
        isDiagonal2OWinning = false;
      }
      if (winnerMap[i][2 - i] !== "x") {
        isDiagonal2XWinning = false;
      }
    }

    if (isDiagonal1OWinning || isDiagonal2OWinning) {
      return "o";
    }
    if (isDiagonal1XWinning || isDiagonal2XWinning) {
      return "x";
    }
  };

  const checkTiedState = () => {
    if (!boardMap.some((row) => row.some((cell) => cell === ""))) {
      Alert.alert(`It's a tie`, `tie`, [
        {
          text: "Restart",
          onPress: resetGame,
        },
      ]);
    }
  };

  const gameEnd = (player) => {
    Alert.alert(`Hurray`, `Player ${player} won`, [
      {
        text: "Restart",
        onPress: resetGame,
      },
    ]);
  };

  const resetGame = () => {
    setMap([
      ["", "", ""], //1st Row
      ["", "", ""], //2nd Row
      ["", "", ""], //3rd Row
    ]);
    setCurrentTurn("x");
  };

  const botTurn = () => {
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

    if (botChoosesOption) {
      onPress(botChoosesOption.row, botChoosesOption.col);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bg}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        <Text onPress={() => onLogout()} style={styles.logOut}>
          Log out
        </Text>
        <Text style={styles.turnText}>
          Current turn: {currentTurn.toUpperCase()}
        </Text>
        <View style={styles.map}>
          {boardMap.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.mapRow}>
              {row.map((cell, columnIndex) => (
                <Cell
                  key={`row-${rowIndex}-col${columnIndex}`}
                  cell={cell}
                  onPress={() => onPress(rowIndex, columnIndex)}
                />
              ))}
            </View>
          ))}
        </View>
        <View style={styles.difficultyButton}>
          <Text
            onPress={() => setGameMode("LOCAL")}
            style={[
              styles.buttonText,
              {
                backgroundColor: gameMode === "LOCAL" ? "#4F5686" : "#191F24",
              }, //if the button is pressed change color
            ]}
          >
            Local
          </Text>
          <Text
            onPress={() => setGameMode("BOT_EASY")}
            style={[
              styles.buttonText,
              {
                backgroundColor:
                  gameMode === "BOT_EASY" ? "#4F5686" : "#191F24",
              },
            ]}
          >
            Easy
          </Text>
          <Text
            onPress={() => setGameMode("BOT_HARD")}
            style={[
              styles.buttonText,
              {
                backgroundColor:
                  gameMode === "BOT_HARD" ? "#4F5686" : "#191F24",
              },
            ]}
          >
            Hard
          </Text>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#242D34",
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",

    //to force the pieces into the center
    paddingTop: 15,
  },

  turnText: {
    fontSize: 24,
    color: "white",
    position: "absolute",
    top: 95,
  },

  map: {
    width: "80%",
    aspectRatio: 1,
  },

  mapRow: {
    flex: 1,
    flexDirection: "row",
  },

  difficultyButton: {
    position: "absolute",
    flexDirection: "row",
    bottom: 50,
  },

  buttonText: {
    color: "white",
    margin: 10,
    fontSize: 20,
    backgroundColor: "#191F24",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 15,
  },

  logOut: {
    position: "absolute",
    right: 5,
    top: 5,
    margin: 20,
    color: "white",
    fontSize: 16,
    padding: 10,
    backgroundColor: "#191F24",
    borderRadius: 10,
  },
});

export default withAuthenticator(App);
