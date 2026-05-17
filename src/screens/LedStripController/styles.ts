import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  card: {
    marginTop: SD.hp(20),
    paddingVertical: SD.hp(20),
    paddingHorizontal: SD.wp(20),
  },
  dropdown: {
    width: "100%",
    paddingHorizontal: SD.wp(5),
    paddingVertical: SD.hp(8),
    borderRadius: 10,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: SD.hp(30),
    left: SD.wp(20),
    right: SD.wp(20),
    gap: SD.hp(12),
  },
  actionBtn: {
    width: "100%",
    height: SD.hp(56),
    borderRadius: 14,
  },
});