import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  wifiIcon: {
    width: SD.wp(137),
    height: SD.hp(137),
    resizeMode: "contain",
    alignSelf: "center",
  },
  wifiSectionContainer: {
    borderRadius: 10,
    marginTop: SD.hp(10),
    height: SD.hp(298),
    overflow: "scroll",
    paddingBottom: SD.hp(10),
  },
  nextBtn: {
    borderRadius: 15,
  },
  nextBtnDisabled: {
    opacity: 0.4,
  },
});
