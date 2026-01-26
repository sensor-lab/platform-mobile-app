import { StyleSheet } from "react-native";
import { SD } from "../../../../utils";

export const styles = StyleSheet.create({
  cardContainer: {
    height: SD.hp(111),
    borderRadius: 20,
    width: SD.wp(111),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SD.hp(5),
    paddingHorizontal: SD.wp(10),
  },
  cardIcon: {
    width: SD.wp(28),
    height: SD.hp(28),
    resizeMode: "contain",
    alignSelf: "center",
  },
});
