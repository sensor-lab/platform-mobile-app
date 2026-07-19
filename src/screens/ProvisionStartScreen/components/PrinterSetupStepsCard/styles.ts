import { StyleSheet } from "react-native";
import { SD } from "../../../../utils";
import { Fonts, ThemeColors } from "../../../../styles";

export const styles = StyleSheet.create({
  printerSetupStepsCardContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SD.hp(10),
  },
  printerSetupStepIconView: {
    borderRadius: 100,
    width: SD.wp(48),
    height: SD.hp(48),
    justifyContent: "center",
    alignItems: "center",
  },
  printerSetupStepIcon: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
});
