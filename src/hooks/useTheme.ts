import { DarkTheme, LightTheme, ThemeColors } from "../styles";

// import {ThemeTypes} from '../constants';
// import { useTypedSelector } from "./useTypedSelected";

const useTheme = () => {
  // const themeType: ThemeTypes = useTypedSelector(
  //   (state) => state.theme.themeType
  // );

  // const isDarkTheme: boolean = themeType === ThemeTypes.Dark;
  const isDarkTheme = false;

  const AppTheme = {
    // ...(isDarkTheme ? DarkTheme : LightTheme),
    ...ThemeColors,
    ...DarkTheme,
  };

  // const AppLogo = require("../assets/images/app-logo.png");

  // return { isDarkTheme, AppTheme, themeType };
  return { isDarkTheme, AppTheme };
};

export { useTheme };
