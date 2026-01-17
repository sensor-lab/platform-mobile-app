import React from "react";
import { Image, ImageProps, StyleSheet } from "react-native";

type CustomImageProps = Omit<ImageProps, "source"> & {
  source: ImageProps["source"];
};

export const CustomImage: React.FC<CustomImageProps> = ({
  source,
  resizeMode,
  ...rest
}) => {
  return (
    <Image source={source} resizeMode={resizeMode || "contain"} {...rest} />
  );
};

const styles = StyleSheet.create({});
