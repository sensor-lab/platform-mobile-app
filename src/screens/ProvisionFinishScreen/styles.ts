import { StyleSheet } from "react-native";
import { Fonts, ThemeColors } from "../../styles";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  skipBtn: {
    alignSelf: "flex-end",
    top: -10,
    color: ThemeColors.fontBlueL,
    fontFamily: Fonts["Medium"],
    fontSize: SD.customFontSize(14),
  },
  section: {
    flex: 1,
    alignItems: "center",
  },
  printerImage: {
    width: "50%",
    height: SD.hp(157),
    resizeMode: "contain",
  },
  stepsSection: {
    // marginTop: SD.hp(2),
    height: SD.hp(400),
  },
  verticalLine: {
    width: SD.wp(2),
    height: SD.hp(20),
    backgroundColor: "#C9CDD4",
    alignSelf: "center",
  },
  footer: {},
  nextBtn: {
    borderRadius: 90,
    height: SD.hp(50),
    width: "70%",
    alignSelf: "center",
  },
});
