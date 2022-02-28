import { View, StyleSheet } from "react-native";
import React from "react";

const Nought = () => {
  return <View style={styles.nought} />;
};

const styles = StyleSheet.create({
  nought: {
    flex: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,

    borderWidth: 10,
    borderColor: "white",
  },
});

export default Nought;
