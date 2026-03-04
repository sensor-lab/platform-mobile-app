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
    marginBottom: SD.hp(30),
  },
  statusIndicator: {
    paddingHorizontal: SD.wp(20),
    paddingVertical: SD.hp(8),
    borderRadius: 15,
    minWidth: 80,
    alignItems: "center",
  },
  brightnessContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: SD.hp(40),
  },
  brightnessControls: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: SD.wp(20),
  },
  brightnessBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: SD.wp(10),
  },
  brightnessDisplay: {
    flex: 1,
    height: 20,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: SD.wp(10),
  },
  brightnessBar: {
    height: "100%",
    borderRadius: 10,
  },
  toggleBtn: {
    width: "80%",
    paddingVertical: SD.hp(15),
    borderRadius: 10,
  },
});