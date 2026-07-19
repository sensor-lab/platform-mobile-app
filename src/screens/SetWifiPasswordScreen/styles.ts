import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SD.hp(24),
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  container: {
    alignItems: "center",
    marginTop: SD.hp(12),
    paddingHorizontal: SD.wp(16),
  },
  networkIconView: {
    borderRadius: 100,
    width: SD.wp(137),
    height: SD.hp(137),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  networkIcon: {
    width: SD.wp(57),
    height: SD.hp(57),
    resizeMode: "contain",
  },
  submitButton: {
    borderRadius: 15,
    marginHorizontal: SD.wp(16),
    marginTop: SD.hp(24),
    marginBottom: SD.hp(8),
  },
});
