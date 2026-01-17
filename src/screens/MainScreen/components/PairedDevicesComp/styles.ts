import { StyleSheet } from "react-native";
import { SD } from "../../../../utils";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SD.wp(10),
    paddingVertical: SD.wp(10),
    width: "95%",
    height: SD.hp(55),
    borderRadius: 10,
    marginVertical: SD.hp(3),
    alignSelf: "center",
  },
  deviceImageView: {
    width: SD.wp(40),
    height: SD.hp(38),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  deviceImage: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
  textView: {},
  statusView: {},
  verticalDots: {
    width: SD.wp(24),
    height: SD.hp(24),
    resizeMode: "contain",
    // zIndex: 5000,
  },
  removeCompContainer: {
    zIndex: 5000,
    flexDirection: "row",
    alignItems: "center",
    width: SD.wp(80),
    height: SD.hp(35),
    borderRadius: 5,
    // top: -20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    // left: 10,
    position: "absolute",
    right: 23,
    top: -7,
    opacity: 1,
  },
  binIcon: {
    width: SD.wp(13),
    height: SD.hp(13),
    resizeMode: "contain",
    right: SD.wp(5),
  },
});
