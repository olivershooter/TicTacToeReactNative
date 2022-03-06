import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
    top: 75,
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
