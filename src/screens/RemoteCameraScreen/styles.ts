import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SD.wp(20),
    paddingTop: SD.hp(20),
  },
  imageArea: {
    flex: 1,
    backgroundColor: "#EEF0F7",
    borderRadius: 16,
    padding: SD.wp(12),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    paddingHorizontal: SD.wp(20),
    paddingVertical: SD.hp(20),
  },
  takePhotoBtn: {
    backgroundColor: "#354F8E",
    borderRadius: 30,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
  },
});