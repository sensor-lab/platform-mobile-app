import React from "react";
import { View, Text, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { styles } from "./styles";
import { useTheme } from "../../hooks";
import { Fonts } from "../../styles";
import { SD } from "../../utils";

interface DropdownProps {
  data: { label: string; value: string | number }[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  dropdownStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  labelField?: string;
  valueField?: string;
  [key: string]: any;
}

const CustomDropdown: React.FC<DropdownProps> = ({
  data,
  value,
  onChange,
  placeholder = "Select...",
  dropdownStyle,
  itemStyle,
  labelField = "label",
  valueField = "value",
  containerStyle,
  ...rest
}) => {
  const { AppTheme } = useTheme();
  return (
    <Dropdown
      data={data}
      value={value}
      onChange={(item) => onChange(item.value)}
      style={[styles.dropdown, dropdownStyle]}
      itemContainerStyle={[styles.itemContainer, itemStyle]}
      placeholder={placeholder}
      selectedTextStyle={{
        color: AppTheme.fontGray,
        // color: "red",
        fontFamily: Fonts["Bold"],
        fontSize: SD.customFontSize(12),
        textTransform: "uppercase",
      }}
      itemTextStyle={{ ...styles.itemTextStyles, color: AppTheme.fontGray }}
      // placeholderStyle={styles.placeholder}
      labelField={labelField} // Specify the labelField for dropdown
      valueField={valueField}
      containerStyle={containerStyle}
      {...rest}
    />
  );
};

export default CustomDropdown;
