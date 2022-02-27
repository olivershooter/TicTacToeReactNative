import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import bg from "./assets/bg.jpeg";

import React, { useState } from "react";

export default function App() {
  const [boardMap, setMap] = useState([
    ["", "", ""], //1st Row
    ["", "", ""], //2nd Row
    ["", "", ""], //3rd Row
  ]);

  const [currentTurn, setCurrentTurn] = useState("x");

  const onPress = (rowIndex, columnIndex) => {
    console.warn("hello", rowIndex, columnIndex);

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

    checkWinningState();
  };

  const checkWinningState = () => {
    //Check the rows
    for (let i = 0; i < 3; i++) {
      const isTheRowAllX = boardMap[i].every((cell) => cell === "x");
      const isTheRowAllO = boardMap[i].every((cell) => cell === "o");
      if (isTheRowAllX) {
        Alert.alert(`X's won. Row: ${i}.`);
      }

      if (isTheRowAllO) {
        Alert.alert(`O's won. Row: ${i}.`);
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
        Alert.alert(`X's won. Column: ${col}.`);
      }

      if (isTheColumnAllO) {
        Alert.alert(`O's won. Column: ${col}.`);
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

    if (isTheDiagonal1AllO) {
      Alert.alert(`O won. Diagonal 1.`);
    }
    if (isTheDiagonal1AllX) {
      Alert.alert(`X won. Diagonal 1.`);
    }
    if (isTheDiagonal2AllO) {
      Alert.alert(`O won. Diagonal 1.`);
    }
    if (isTheDiagonal2AllX) {
      Alert.alert(`X won. Diagonal 1.`);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={bg}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        <View style={styles.map}>
          {boardMap.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.mapRow}>
              {row.map((cell, columnIndex) => (
                <Pressable
                  key={`row-${rowIndex}-${columnIndex}`}
                  onPress={() => onPress(rowIndex, columnIndex)}
                  style={styles.mapCell}
                >
                  {cell === "o" && <View style={styles.nought} />}
                  {cell === "x" && (
                    <View style={styles.crossContainer}>
                      <View style={styles.crossLine} />
                      <View
                        style={[styles.crossLine, styles.crossLineInvert]}
                      />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          ))}

          {/* <View style={styles.nought} />

          <View style={styles.crossContainer}>
            <View style={styles.crossLine} />
            <View style={[styles.crossLine, styles.crossLineInvert]} />
          </View> */}
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

    //to force the nought into the center
    paddingTop: 15,
  },

  map: {
    width: "80%",
    aspectRatio: 1,
  },

  mapCell: { flex: 1 },

  mapRow: {
    flex: 1,
    flexDirection: "row",
  },

  nought: {
    flex: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,

    borderWidth: 10,
    borderColor: "white",
  },

  crossContainer: {
    flex: 1,
  },

  crossLine: {
    position: "absolute",
    left: "48%",
    width: 10,
    height: "100%",
    borderRadius: 5,
    backgroundColor: "white",
    transform: [{ rotate: "45deg" }],
  },

  crossLineInvert: {
    transform: [{ rotate: "-45deg" }],
  },
});
