import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    alignSelf: "center",
    padding: SD.hp(20),
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SD.hp(40),
  },
  deviceIcon: {
    width: SD.wp(137),
    height: SD.hp(137),
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: SD.hp(20),
  },
  modalBtnsView: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SD.hp(40),
  },
});
