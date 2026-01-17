import { Platform } from "react-native";

const ENFonts =
  Platform.OS === "android"
    ? {
        BlackBold: "NotoSansSC-Black",
        Bold: "NotoSansSC-Bold",
        SemiBold: "NotoSansSC-SemiBold",
        Regular: "NotoSansSC-Regular",
        Medium: "NotoSansSC-Medium",
        LightItalic: "NotoSansSC-Light",
        Light: "NotoSansSC-Light",
      }
    : {
        BlackBold: "NotoSansSC-Black",
        Bold: "NotoSansSC-Bold",
        SemiBold: "NotoSansSC-SemiBold",
        Regular: "NotoSansSC-Regular",
        Medium: "NotoSansSC-Medium",
        LightItalic: "NotoSansSC-Light",
        Light: "NotoSansSC-Light",
      };

export { ENFonts };
export default ENFonts;
