import { StyleSheet } from "react-native";
import { SD } from "../../utils";

const TRACK_HEIGHT = SD.hp(90);
const THUMB_SIZE = SD.hp(78);

export const styles = StyleSheet.create({
  dropdown: {
    width: "100%",
    paddingHorizontal: SD.wp(5),
    paddingVertical: SD.hp(8),
    borderRadius: 10,
  },
  // ── Mode selector ──────────────────────────────────────────────────────────
  modeSelector: {
    flexDirection: "row",
    borderRadius: SD.hp(12),
    overflow: "hidden",
  },
  modeBtn: {
    flex: 1,
    paddingVertical: SD.hp(18),
    alignItems: "center",
    justifyContent: "center",
  },
  modeBtnLeft: {
    borderTopLeftRadius: SD.hp(12),
    borderBottomLeftRadius: SD.hp(12),
  },
  modeBtnRight: {
    borderTopRightRadius: SD.hp(12),
    borderBottomRightRadius: SD.hp(12),
  },
  // ── Toggle ─────────────────────────────────────────────────────────────────
  loaderContainer: {
    height: TRACK_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleTrack: {
    width: "100%",
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  toggleThumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});