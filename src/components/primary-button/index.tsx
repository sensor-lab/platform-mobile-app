import React, { FC } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../hooks";
import { SD } from "../../utils";
import Text from "../text";

export type PrimaryButtonProps = TouchableOpacityProps & {
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  width?: number | string;
  color?: string;
  textColor?: string;
  customStyles?: StyleProp<ViewStyle>;
  fontSize?: number;
  isSecondary?: boolean;
};

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  title,
  onPress,
  isLoading,
  disabled,
  width = "100%",
  color,
  textColor = "#ffffff",
  customStyles,
  fontSize = 20,
  isSecondary = false,
  ...rest
}) => {
  const { AppTheme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: color || AppTheme.fontBlueL,
          // backgroundColor: disabled ?AppTheme.Secondary : color,
          // width: width,
        },
        isSecondary && {
          borderWidth: 1,
          borderColor: AppTheme.Primary,
          backgroundColor: AppTheme.Transparent,
        },
        disabled && {
          backgroundColor: AppTheme.InActiveTabBar,
        },
        customStyles,
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          semiBold
          size={fontSize}
          color={isSecondary ? AppTheme.Primary : textColor}
        >
          {title}
        </Text>
        // <Text style={{ color: textColor }}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: SD.hp(51),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SD.hp(10),
    borderRadius: SD.hp(15),
    // verticalAlign: "bottom",
    // ...Metrix.createShadow(),
  },
  // titleText:{
  //   fontFamily: Fonts['Futura-Medium'],
  //   fontSize: Metrix.customFontSize(16),
  //   color: Colors.Primary,
  // }
});
