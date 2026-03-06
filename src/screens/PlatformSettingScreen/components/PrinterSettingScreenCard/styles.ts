import { StyleSheet } from "react-native";
import { SD } from "../../../../utils";

export const styles = StyleSheet.create({
  cardContainer: {
    height: SD.hp(111),
    borderRadius: 20,
    width: SD.wp(111),
    margin: SD.wp(3),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SD.hp(5),
    paddingHorizontal: SD.wp(10),
    position: "relative", // Enable absolute positioning for children
  },
  cardIcon: {
    width: SD.wp(28),
    height: SD.hp(28),
    resizeMode: "contain",
    alignSelf: "center",
  },
  removeCompContainer: {
    position: "absolute",
    top: SD.hp(-5),
    right: SD.wp(8),
    zIndex: 5000,
    flexDirection: "row",
    alignItems: "center",
    width: SD.wp(80),
    height: SD.hp(35),
    borderRadius: 5,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  binIcon: {
    width: SD.wp(13),
    height: SD.hp(13),
    resizeMode: "contain",
    right: SD.wp(5),
  },
  verticalDotsContainer: {
    position: "absolute",
    top: SD.hp(8),
    right: SD.wp(8),
    zIndex: 1000,
  },
  verticalDots: {
    width: SD.wp(20),
    height: SD.hp(20),
    resizeMode: "contain",
  },
});
