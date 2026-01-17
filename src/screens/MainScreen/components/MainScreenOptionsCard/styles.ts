import { StyleSheet } from "react-native";
import { SD } from "../../../../utils";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { Fonts, ThemeColors } from "../../../../styles";

export const styles = StyleSheet.create({
  mainScreenOptionCard: {
    // paddingVertical: SD.hp(20),
    // width: widthPercentageToDP(42),
    // height: SD.hp(133),
    width: widthPercentageToDP(40),
    height: SD.hp(133),
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SD.hp(10),
    paddingHorizontal: SD.wp(15),
    paddingBottom: SD.hp(20),
  },
  cardIcon: {
    width: SD.wp(24),
    height: SD.hp(24),
    resizeMode: "contain",
    // marginBottom: SD.hp(10),
    flex: 1,
  },
});
