import { StyleSheet } from "react-native";
import { Fonts, ThemeColors } from "../../styles";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingBottom: SD.hp(20),
    // paddingTop: SD.hp(10),
    // alignItems: "center",
    // borderWidth: 1,
  },
  logoStyles: {
    width: SD.wp(255),
    height: SD.hp(53),
    alignSelf: "center",
    flex: 1,
  },
  backHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: SD.hp(10),
    flex: 1,
  },
  backIcon: {
    width: SD.wp(34),
    height: SD.hp(34),
    resizeMode: "contain",
  },
  headerTitle: {
    textAlign: "center",
    flex: 1,
    fontFamily: Fonts["Bold"],
    fontSize: SD.customFontSize(18),
    color: ThemeColors.Black,
    right: SD.wp(10),
  },
  plusIcon: {
    width: SD.wp(32),
    height: SD.hp(32),
    resizeMode: "contain",
  },
});
