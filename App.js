import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";

import React, { useState } from "react";

import bg from "./assets/bg.jpeg";

import Cell from "./assets/src/components/Cell";

const emptyBoardMap = [
  ["", "", ""], //1st Row
  ["", "", ""], //2nd Row
  ["", "", ""], //3rd Row
];

export default function App() {
  const [boardMap, setMap] = useState(emptyBoardMap);

  const [currentTurn, setCurrentTurn] = useState("x");

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

    const winner = getWinner();
    if (winner) {
      gameEnd(winner);
    } else {
      checkTiedState();
    }
  };

  const getWinner = () => {
    //Check the rows
    for (let i = 0; i < 3; i++) {
      const isTheRowAllX = boardMap[i].every((cell) => cell === "x");
      const isTheRowAllO = boardMap[i].every((cell) => cell === "o");
      if (isTheRowAllX) {
        return "x";
      }

      if (isTheRowAllO) {
        return "o";
      }
    }

    //Check the columns
    for (let col = 0; col < 3; col++) {
      let isTheColumnAllX = true;
      let isTheColumnAllO = true;

      for (let row = 0; row < 3; row++) {
        if (boardMap[row][col] != "x") {
          isTheColumnAllX = false;
        }
        if (boardMap[row][col] != "o") {
          isTheColumnAllO = false;
        }
      }

      if (isTheColumnAllX) {
        return "x";
      }

      if (isTheColumnAllO) {
        return "o";
      }
    }
    //Check the diagonals
    let isTheDiagonal1AllO = true;
    let isTheDiagonal1AllX = true;

    //This one is for the second diagonal
    let isTheDiagonal2AllO = true;
    let isTheDiagonal2AllX = true;

    for (let i = 0; i < 3; i++) {
      if (boardMap[i][i] != "o") {
        isTheDiagonal1AllO = false;
      }
      if (boardMap[i][i] != "x") {
        isTheDiagonal1AllX = false;
      }

      //Check second diagonal
      if (boardMap[i][2 - i] != "o") {
        isTheDiagonal2AllO = false;
      }
      if (boardMap[i][2 - i] != "x") {
        isTheDiagonal2AllX = false;
      }
    }

    if (isTheDiagonal1AllO || isTheDiagonal2AllO) {
      return "o";
    }
    if (isTheDiagonal1AllX || isTheDiagonal2AllX) {
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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bg}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
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
    top: 50,
  },

  map: {
    width: "80%",
    aspectRatio: 1,
  },

  mapRow: {
    flex: 1,
    flexDirection: "row",
  },
});
