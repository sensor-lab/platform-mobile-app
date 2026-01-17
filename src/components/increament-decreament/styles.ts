import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: SD.hp(10),
    height: SD.hp(50),
    borderRadius: 10,
    padding: SD.wp(5),
  },
  btn: {
    width: SD.wp(42),
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 5,
  },
  btnIcon: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  inputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
