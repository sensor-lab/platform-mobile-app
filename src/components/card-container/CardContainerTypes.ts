import { ReactNode } from "react";
import { TouchableOpacityProps, ViewProps, ViewStyle } from "react-native";

export type CardContainerProps = TouchableOpacityProps & {
  children: ReactNode;
  borderColor?: string;
  customStyles?: ViewProps["style"];
  cardContainerRef?: any;
  backgroundColor?: string;
  showSimpleView?: boolean;
  showShadow?: boolean;
};
