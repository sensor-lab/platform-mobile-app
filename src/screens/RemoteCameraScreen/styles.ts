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
  recordingContainer: {
    alignItems: "center",
    marginBottom: SD.hp(20),
  },
  statusIndicator: {
    paddingHorizontal: SD.wp(20),
    paddingVertical: SD.hp(8),
    borderRadius: 15,
    minWidth: 80,
    alignItems: "center",
  },
  photoCountContainer: {
    alignItems: "center",
    marginBottom: SD.hp(30),
    paddingHorizontal: SD.wp(20),
    paddingVertical: SD.hp(15),
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  controlBtn: {
    width: "80%",
    paddingVertical: SD.hp(15),
    borderRadius: 10,
    marginBottom: SD.hp(15),
  },
});