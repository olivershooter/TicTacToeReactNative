import { StyleSheet, Pressable } from "react-native";
import React from "react";

import Cross from "./Cross";
import Nought from "./Nought";

const Cell = (props) => {
  const { cell, onPress } = props;
  return (
    <Pressable onPress={() => onPress()} style={styles.mapCell}>
      {cell === "o" && <Nought />}
      {cell === "x" && <Cross />}
    </Pressable>
  );
};

const styles = StyleSheet.create({ mapCell: { flex: 1 } });
export default Cell;
