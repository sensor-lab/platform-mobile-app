import { StyleSheet } from "react-native";
import { Fonts } from "../../styles";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  deviceImage: {
    width: "80%",
    height: SD.hp(151),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: -100,
  },
  btnsView: {
    marginTop: SD.hp(10),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionBtn: {
    width: "45%",
    height: SD.hp(40),
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshIcon: {
    width: SD.wp(16),
    height: SD.hp(16),
    resizeMode: "contain",
    right: SD.wp(10),
  },
  cardsSection: {
    marginTop: SD.hp(10),
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  clibModalContainer: {
    width: "90%",
    height: SD.hp(350),
    borderRadius: 20,
    paddingVertical: SD.hp(10),
    paddingHorizontal: SD.wp(10),
    justifyContent: "center",
    alignItems: "center",
  },
  clibModalContentContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
    paddingHorizontal: SD.wp(10),
  },
  modalBtn: {
    width: "100%",
  },
  customDropdownStyle: {
    width: "100%",
    borderRadius: 15,
  },
  dropdownPlaceHoldertextStyles: {
    fontFamily: Fonts["Bold"],
    fontSize: SD.customFontSize(12),
  },
  customItemStyle: {
    borderRadius: 15,
  },
  itemContainerStyle: {
    borderRadius: 15,
    padding: SD.wp(10),
  },
});
