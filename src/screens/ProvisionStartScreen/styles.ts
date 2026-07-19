import { StyleSheet } from "react-native";
import { Fonts } from "../../styles";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  skipBtn: {
    alignSelf: "flex-end",
    color: "#2F57A2",
    fontFamily: Fonts["Medium"],
    fontSize: SD.customFontSize(14),
    marginTop: SD.hp(4),
  },
  section: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    marginTop: SD.hp(18),
    lineHeight: SD.hp(40),
    color: "#0D1220",
  },
  descriptionPrimary: {
    marginTop: SD.hp(14),
    lineHeight: SD.hp(22),
    paddingHorizontal: SD.wp(10),
  },
  description: {
    marginTop: SD.hp(8),
    lineHeight: SD.hp(22),
    paddingHorizontal: SD.wp(10),
  },
  printerImage: {
    marginTop: SD.hp(26),
    width: "88%",
    height: SD.hp(420),
    resizeMode: "contain",
  },
  footer: {
    paddingBottom: SD.hp(8),
  },
  nextBtn: {
    borderRadius: 999,
    height: SD.hp(50),
    width: "100%",
    alignSelf: "center",
  },
});
