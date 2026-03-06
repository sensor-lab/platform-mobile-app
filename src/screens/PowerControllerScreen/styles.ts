import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  controlContainer: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SD.hp(20),
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: SD.hp(20),
  },
  statusIndicator: {
    paddingHorizontal: SD.wp(20),
    paddingVertical: SD.hp(8),
    borderRadius: 15,
    minWidth: 100,
    alignItems: "center",
  },
  connectBtn: {
    width: "80%",
    paddingVertical: SD.hp(15),
    borderRadius: 10,
    marginBottom: SD.hp(30),
  },
  pinSelectionContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: SD.hp(20),
  },
  dropdown: {
    width: "100%",
    paddingHorizontal: SD.wp(15),
    paddingVertical: SD.hp(12),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  pinStatusContainer: {
    alignItems: "center",
    marginBottom: SD.hp(25),
    width: "100%",
  },
  controlButtonsContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: SD.hp(20),
  },
  controlBtn: {
    width: "80%",
    paddingVertical: SD.hp(15),
    borderRadius: 10,
    marginBottom: SD.hp(15),
  },
  resetBtn: {
    width: "80%",
    paddingVertical: SD.hp(15),
    borderRadius: 10,
    marginBottom: SD.hp(20),
  },
  activePinsContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingVertical: SD.hp(15),
    paddingHorizontal: SD.wp(15),
  },
  activePinsList: {
    width: "100%",
  },
  activePinItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SD.hp(5),
    paddingHorizontal: SD.wp(10),
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginBottom: SD.hp(5),
  },
});