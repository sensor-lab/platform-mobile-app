import React from "react";
import { Image, ImageProps, StyleSheet, View, ViewStyle } from "react-native";
import { Images } from "../../config";
import Text from "../text";
import { SD } from "../../utils";

type EmptyStateProps = {
  src?: ImageProps["source"];
  customStyle?: ViewStyle;
  customContainerStyle?: ViewStyle;
  text?: string;
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  src,
  customStyle,
  customContainerStyle,
  text = "No Data Found",
}) => {
  return (
    <View style={[styles.emptyState, customStyle]}>
      <View style={[styles.containerStyle, customContainerStyle]}>
        <Image
          source={src ? src : Images.NoResults}
          style={{ width: "100%", height: "100%" }}
          resizeMode="contain"
        />
      </View>

      <Text bold size={20} centered>
        {text || ""}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    // borderWidth: 1,
    // borderColor: 'red',
    width: SD.wp(350),
    height: SD.hp(300),
    // alignSelf: 'center',
  },
  emptyState: {
    // borderWidth: 2,
    // borderColor: 'green',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    paddingHorizontal: SD.wp(50),
    marginTop: SD.hp(50),
  },
});
