import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SD.wp(10),
  },
  icon: {
    width: SD.wp(18),
    height: SD.hp(18),
    resizeMode: "contain",
  },
});
