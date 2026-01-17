import React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { Images } from "../../config";
import { useTheme } from "../../hooks";
import { SD } from "../../utils";
import Text from "../text";

type BackHeaderProps = {
  heading?: string;
  customeStyle?: StyleProp<ViewStyle>;
  btnImage?: ImageSourcePropType;
  backArrow?: boolean;
  backFunction?: () => void;
  btnImageStyle?: ImageStyle;
  backBtnImageStyle?: ImageStyle;
  btnFunction?: () => void;
  isPrimary?: boolean;
  mainContainerStyle?: ViewStyle;
  headingContainerSyle?: ViewProps["style"];
};

export const BackHeader: React.FC<BackHeaderProps> = ({
  heading = "",
  customeStyle,
  backArrow = true,
  backFunction,
  // = () => NavigationService.goBack()
  backBtnImageStyle,
  btnImage,
  btnImageStyle,
  btnFunction,
  isPrimary = true,
  mainContainerStyle,
  headingContainerSyle,
}) => {
  const { AppTheme } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: AppTheme.Transparent,
        },
        mainContainerStyle,
      ]}
    >
      <View style={[styles.container, customeStyle]}>
        {backArrow ? (
          <TouchableOpacity style={styles.backButton} onPress={backFunction}>
            <Image
              source={Images.BackBtn}
              style={[
                styles.backImage,
                isPrimary && { tintColor: AppTheme.Primary },
                backBtnImageStyle,
              ]}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.backButton} />
        )}
        <View style={[styles.headingContainer, headingContainerSyle]}>
          <Text semiBold size={20} centered>
            {heading}
          </Text>
        </View>
        {btnImage && (
          <TouchableOpacity
            style={[styles.backButton, { alignItems: "flex-end" }]}
            onPress={btnFunction}
          >
            <Image
              source={btnImage}
              style={[styles.backImage, btnImageStyle]}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingBottom: SD.hp(20),
    paddingTop: SD.hp(10),
    // borderWidth: 1,
  },
  backButton: {
    width: "10%",
    // borderWidth: 1,
  },
  backImage: {
    width: SD.wp(25),
    height: SD.hp(25),
    // borderWidth: 1,
  },
  headingContainer: {
    width: "84%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    // borderWidth: 1,
  },
});
