import {
  ColorValue,
  ImageSourcePropType,
  KeyboardTypeOptions,
  Pressable,
  StyleProp,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { styles } from "./styles";
import React from "react";
import { useTheme } from "../../hooks";
import { Fonts } from "../../styles";
import { SD } from "../../utils";
import { CustomImage } from "../custom-image";

type Props = {
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  fontSize?: number;
  placeholderTextColor?: string;
  backgroundColor?: ColorValue;
  bold?: boolean;
  value: string;
  setValue: (e: string) => void;
  secureText?: boolean;
  textColor?: ColorValue;
  [key: string]: any;
  regular?: boolean;
  medium?: boolean;
  multiline?: boolean;
  height?: number;
  radius?: number;
  topSpacing?: number;
  bottomSpacing?: number;
  leftSpacing?: number;
  rightSpacing?: number;
  verticalSpacing?: number;
  horizentalSpacing?: number;
  style?: TextStyle;
  disable?: boolean;
  icon?: ImageSourcePropType;
  containerStyles?: ViewStyle;
  onIconPress?: () => void;
};
export const CustomTextInput: React.FC<Props> = ({
  placeholder,
  keyboardType = "default",
  fontSize = 16,
  placeholderTextColor,
  backgroundColor,
  bold,
  value,
  setValue,
  secureText,
  textColor,
  regular,
  medium,
  multiline,
  height = 50,
  radius = 10,
  topSpacing,
  bottomSpacing,
  rightSpacing,
  leftSpacing,
  verticalSpacing,
  horizentalSpacing,
  style,
  disable,
  icon,
  containerStyles,
  onIconPress,
  ...rest
}) => {
  const { AppTheme } = useTheme();
  return (
    <View
      style={[
        {
          ...styles.container,
          backgroundColor: backgroundColor,
          height: SD.hp(height),
          borderRadius: radius,
          marginVertical: verticalSpacing,
          marginHorizontal: horizentalSpacing,
          left: leftSpacing,
          right: rightSpacing,
          top: topSpacing,
          bottom: bottomSpacing,
        },
        containerStyles,
      ]}
    >
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType || "default"}
        value={value}
        onChangeText={setValue}
        secureTextEntry={secureText}
        multiline={multiline}
        editable={!disable}
        style={[
          {
            fontSize: SD.customFontSize(fontSize),
            color: textColor || AppTheme.Black,
            fontFamily: bold
              ? Fonts["Bold"]
              : regular
              ? Fonts["Regular"]
              : medium
              ? Fonts["Medium"]
              : Fonts["SemiBold"],
            flex: 1,
          },
          style,
        ]}
        {...rest}
      />
      {icon && (
        <Pressable onPress={onIconPress}>
          <CustomImage
            source={icon}
            style={{ ...styles.icon, tintColor: AppTheme.Primary }}
          />
        </Pressable>
      )}
    </View>
  );
};
