import { StatusBar } from "expo-status-bar";
import { Text, View, ImageBackground, Alert } from "react-native";
import React, { useState, useEffect } from "react";

//App
import bg from "./assets/bg.jpeg";

import Cell from "./src/components/Cell";
import { emptyBoardMap } from "./src/utils/index.js";
import { getWinner, isTie } from "./src/utils/gameLogic.js";
import { botTurn } from "./src/utils/botLogic";

//Stylesheet
import styles from "./App.style";

//AWS
import Amplify from "aws-amplify";
import { Analytics } from "aws-amplify";
import { Auth } from "aws-amplify";
import config from "./src/aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";
import { DataStore } from "@aws-amplify/datastore";
import { Game } from "./src/models";
Amplify.configure({ ...config, Analytics: { disabled: true } });

function App() {
  const [boardMap, setMap] = useState(emptyBoardMap);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [gameMode, setGameMode] = useState("BOT_HARD");
  const [game, setGame] = useState(null);
  const [userData, setUserData] = useState(null);
  const [ourPlayerType, setOurPlayerType] = useState(null);

  useEffect(() => {
    resetGame();
    if (gameMode === "ONLINE") {
      findOrCreateOnlineGame();
    } else {
      deleteTempGame();
    }
  }, [gameMode]);

  useEffect(() => {
    if (currentTurn === "O" && ["BOT_EASY", "BOT_HARD"].includes(gameMode)) {
      const botChoosesOption = botTurn(boardMap, gameMode);
      if (botChoosesOption) {
        onPress(botChoosesOption.row, botChoosesOption.col);
      }
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    if (!game) {
      return;
    }
    DataStore.save(
      Game.copyOf(game, (g) => {
        g.currentPlayer = currentTurn;
        g.boardMap = JSON.stringify(boardMap);
      })
    );
  }, [currentTurn, boardMap]);

  useEffect(() => {
    const winner = getWinner(boardMap);
    if (winner) {
      gameEnd(winner);
    } else {
      checkTiedState();
    }
  }, [boardMap]);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then(setUserData);
  }, []);

  useEffect(() => {
    if (!game) {
      return;
    }
    const subscription = DataStore.observe(Game, game.id).subscribe((msg) => {
      console.log(msg.model, msg.opType, msg.element);
      if (msg.opType === "UPDATE") {
        setGame(msg.element);
        setMap(JSON.parse(msg.element.boardMap));
        setCurrentTurn(msg.element.currentPlayer);
      }
    });

    return () => subscription.unsubscribe();
  }, [game]);

  const findOrCreateOnlineGame = async () => {
    //Search for an online game
    const games = await getAvailableGames();

    if (games.length > 0) {
      joinGame(games[0]);
    } else {
      //If no available online games, create a new game and wait
      await createANewGame();
    }
  };

  const joinGame = async (game) => {
    const updatedGame = await DataStore.save(
      Game.copyOf(game, (updatedGame) => {
        updatedGame.playerO = userData.attributes.sub;
      })
    );
    setGame(updatedGame);
    setOurPlayerType("O");
  };

  const getAvailableGames = async () => {
    const games = await DataStore.query(Game, (g) => g.playerO("eq", null));
    return games;
  };

  const createANewGame = async () => {
    const emptyStringMap = JSON.stringify([
      ["", "", ""], //1st Row
      ["", "", ""], //2nd Row
      ["", "", ""], //3rd Row
    ]);

    const newGame = new Game({
      playerX: userData.attributes.sub, //
      map: emptyStringMap, //
      currentPlayer: "X", //
      pointsX: 0,
      pointsO: 0,
    });
    const createdGame = await DataStore.save(newGame);
    setGame(createdGame);
    setOurPlayerType("O");
  };

  const deleteTempGame = async () => {
    if (!game || game.playerO) {
      setGame(null);
      return;
    }

    await DataStore.delete(Game, game.id);
    setGame(null);
  };

  const onPress = (rowIndex, columnIndex) => {
    if (gameMode === "ONLINE" && game?.currentPlayer !== ourPlayerType) {
      Alert.alert("Not your turn");
      return;
    }

    if (boardMap[rowIndex][columnIndex] !== "") {
      Alert.alert("Position already occupied");
      return;
    }

    setMap((existingMap) => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });

    setCurrentTurn(currentTurn === "X" ? "O" : "X");
  };

  const onLogout = async () => {
    await DataStore.clear();
    Auth.currentAuthenticatedUser().then((user) => user.signOut());
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
    setCurrentTurn("X");
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
        {game && <Text style={styles.gameID}>Game ID: {game.id}</Text>}
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
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              flexWrap: "wrap",
            }}
          >
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
            <Text
              onPress={() => setGameMode("ONLINE")}
              style={[
                styles.buttonText,
                {
                  backgroundColor:
                    gameMode === "ONLINE" ? "#4F5686" : "#191F24",
                },
              ]}
            >
              Online
            </Text>
          </View>
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

export default withAuthenticator(App);
