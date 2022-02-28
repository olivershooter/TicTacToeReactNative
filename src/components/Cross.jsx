import { View, StyleSheet } from "react-native";
import React from "react";

const Cross = () => {
  return (
    <View style={styles.crossContainer}>
      <View style={styles.crossLine} />
      <View style={[styles.crossLine, styles.crossLineInvert]} />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Cross;
