import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    height: SD.hp(117),
    paddingTop: SD.hp(15),
    marginVertical: SD.hp(10),
  },
  valueContainer: {
    height: SD.hp(50),
    width: "100%",
    borderRadius: 10,
    marginVertical: SD.hp(12),
    justifyContent: "center",
    paddingTop: 0,
  },
});
