import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SD.wp(7),
    paddingVertical: SD.hp(7),
  },
  headerBtn: {
    justifyContent: "center",
    alignItems: "center",
    width: "47%",
    height: SD.hp(42),
    borderRadius: 10,
  },
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
  textInputStyles: {
    padding: SD.wp(10),
  },
});
