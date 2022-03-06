import { StatusBar } from "expo-status-bar";
import { Text, View, ImageBackground, Alert } from "react-native";
import React, { useState, useEffect } from "react";

//App
import bg from "./assets/bg.jpeg";

import styles from "./App.style";

import Cell from "./src/components/Cell";
import { emptyBoardMap } from "./src/utils/index.js";
import { getWinner, isTie } from "./src/utils/gameLogic.js";
import { botTurn } from "./src/utils/botLogic";

//AWS
import Amplify from "aws-amplify";
import { Auth } from "aws-amplify";
import config from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
Amplify.configure(config);

function App() {
  const [boardMap, setMap] = useState(emptyBoardMap);
  const [currentTurn, setCurrentTurn] = useState("x");
  const [gameMode, setGameMode] = useState("BOT_HARD");

  useEffect(() => {
    if (currentTurn === "o" && gameMode != "LOCAL") {
      const botChoosesOption = botTurn(boardMap, gameMode);
      if (botChoosesOption) {
        onPress(botChoosesOption.row, botChoosesOption.col);
      }
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

  const checkTiedState = () => {
    if (isTie(boardMap)) {
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

export default withAuthenticator(App);
