import { Platform } from "react-native";

const ENFonts =
  Platform.OS === "android"
    ? {
        BlackBold: "Lato-Black",
        Bold: "Lato-Bold",
        SemiBold: "Lato-Semibold",
        Regular: "Lato-Regular",
        Medium: "Lato-Medium",
        LightItalic: "Lato-LightItalic",
        Light: "Lato-Light",
      }
    : {
        BlackBold: "Lato-Black",
        Bold: "Lato-Bold",
        SemiBold: "Lato-Semibold",
        Regular: "Lato-Regular",
        Medium: "Lato-Medium",
        LightItalic: "Lato-LightItalic",
        Light: "Lato-Light",
      };

export { ENFonts };
export default ENFonts;
