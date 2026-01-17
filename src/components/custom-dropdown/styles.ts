import { StyleSheet } from "react-native";
import { SD } from "../../utils";
import { Fonts } from "../../styles";

export const styles = StyleSheet.create({
  container: {
    marginBottom: SD.hp(16),
    width: "100%",
    flex: 1,
  },
  dropdown: {
    // backgroundColor: "#f0f0f0",
    borderRadius: 10,
    height: SD.hp(48),
    // justifyContent: "center",
    paddingHorizontal: SD.wp(12),
    width: "100%",
  },
  itemContainer: {
    // backgroundColor: "white",
    // paddingVertical: SD.hp(10),
    // paddingHorizontal: SD.wp(15),
    paddingBottom: 0,
  },
  placeholder: {
    fontSize: SD.customFontSize(16),
    // color: "#888",
  },
  itemTextStyles: {
    fontFamily: Fonts["Bold"],
    fontSize: SD.customFontSize(12),
  },
});
