import { Dimensions, PixelRatio, Platform } from "react-native";
import {
  widthPercentageToDP as lwp,
  heightPercentageToDP as lhp,
} from "react-native-responsive-screen";
import { ThemeColors } from "../styles";

const guidelineBaseWidth = 393;
// const guidelineBaseWidth = 500;

const guidelineBaseHeight = 852;

// here 393 is adobe design width (px)
const getWidthValue = (px: number) => ((px * 100) / 39300) * 100;

// here 852 is adobe design height (px)
const getHeightValue = (px: number) => ((px * 100) / 85200) * 100;

const { width, height }: { width: number; height: number } =
  Dimensions.get("window");
const [shortDimension, longDimension]: [number, number] =
  width < height ? [width, height] : [height, width];

const scalef = (size: number): number =>
  (shortDimension / guidelineBaseWidth) * size;

const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scalef(size) - size) * factor;

export const normalizeFont = (size: number): number => {
  // For Normalizing the font size for all type of screens, Including iPad, iPhone, Tablet, Android
  const newSize: number = moderateScale(size);
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
};
const wp = (px: number) => lwp(getWidthValue(px));
const hp = (px: number) => lhp(getHeightValue(px));

export const createShadow = {
  // shadowColor:
  //   Platform.OS == "android" ? "#D3D3D3" : ThemeColors.TextInputBorderColor,
  // shadowOffset: {
  //   width: wp(3),
  //   height: hp(2),
  // },
  // shadowOpacity: 3,
  // shadowRadius: 18,

  // elevation: hp(20),
  shadowColor: ThemeColors.TextInputBorderColor,
  shadowOffset: { width: wp(0), height: hp(4) },
  shadowOpacity: 0.08,
  shadowRadius: 5,
  elevation: hp(4),
};

export default {
  wp,
  hp,
  customFontSize: normalizeFont,
  createShadow,
};
