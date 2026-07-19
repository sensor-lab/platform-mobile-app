import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: SD.wp(16),
    paddingTop: SD.hp(16),
  },
  subtitle: {
    color: "#0D1220",
    marginBottom: SD.hp(8),
  },
  hint: {
    lineHeight: SD.hp(20),
    marginBottom: SD.hp(24),
  },
  card: {
    borderRadius: SD.hp(12),
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "#F5F6F8",
    padding: SD.hp(16),
    minHeight: SD.hp(210),
    marginBottom: SD.hp(16),
  },
  cardSelected: {
    borderColor: "#2F57A2",
    backgroundColor: "#FFFFFF",
  },
  cardTitle: {
    color: "#0D1220",
    marginBottom: SD.hp(8),
  },
  cardDescription: {
    lineHeight: SD.hp(20),
  },
  footer: {
    paddingBottom: SD.hp(8),
    paddingHorizontal: SD.wp(16),
  },
  nextBtn: {
    borderRadius: 999,
    height: SD.hp(50),
    width: "100%",
    alignSelf: "center",
  },
  nextBtnDisabled: {
    opacity: 0.4,
  },
});
