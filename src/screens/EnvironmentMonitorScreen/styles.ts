import { StyleSheet } from "react-native";
import { SD } from "../../utils";

export const styles = StyleSheet.create({
  dropdown: {
    width: "100%",
    paddingHorizontal: SD.wp(5),
    paddingVertical: SD.hp(8),
    borderRadius: 10,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: SD.hp(25),
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SD.hp(15),
  },
  statusIndicator: {
    paddingHorizontal: SD.wp(15),
    paddingVertical: SD.hp(6),
    borderRadius: 12,
    marginLeft: SD.wp(10),
    alignItems: "center",
  },
  dataContainer: {
    marginBottom: SD.hp(30),
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SD.hp(15),
  },
  dataCard: {
    flex: 1,
    padding: SD.wp(15),
    borderRadius: 12,
    marginHorizontal: SD.wp(5),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    paddingHorizontal: SD.wp(10),
    paddingVertical: SD.hp(4),
    borderRadius: 10,
    marginTop: SD.hp(5),
  },
  controlContainer: {
    alignItems: "center",
    paddingTop: SD.hp(20),
  },
  toggleBtn: {
    width: "80%",
    height: SD.hp(56),
    borderRadius: 10,
  },
});