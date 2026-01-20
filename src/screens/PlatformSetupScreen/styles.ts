import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  dropdownStyles: {
    top: SD.hp(10),
    backgroundColor: "white",
  },
  customItemStyle: {
    borderRadius: 15,
  },
  itemContainerStyle: {
    borderRadius: 15,
  },
  textSection: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderStyles: {
    width: "100%",
    marginTop: SD.hp(10),
    height: SD.hp(50),
    // height: 1,
  },
});
