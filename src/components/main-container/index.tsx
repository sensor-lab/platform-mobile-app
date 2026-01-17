import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

import { useTheme } from "../../hooks";
import { SD } from "../../utils";
import { ToucableFeedback } from "../toucableFeedback";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type MainContainerProps = {
  children?: ReactNode;
  customeStyle?: StyleProp<ViewStyle>;
  hidden?: boolean;
  mainContainerStyle?: StyleProp<ViewStyle>;
  barStyle?: "default" | "light-content" | "dark-content";
  barBg?: string;
  isFlatList?: boolean;
};

export const MainContainer: React.FC<MainContainerProps> = ({
  children,
  customeStyle,
  hidden = false,
  mainContainerStyle,
  barStyle = "dark-content",
  barBg,
  isFlatList,
}) => {
  const { AppTheme } = useTheme();
  return (
    // <KeyboardAvoidingView
    //   style={{ flex: 1 }}
    //   behavior={Platform.OS == "ios" ? "padding" : "height"}
    //   keyboardVerticalOffset={10}
    // >
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: AppTheme.Base }, mainContainerStyle]}
    >
      <StatusBar
        hidden={hidden}
        barStyle={barStyle}
        backgroundColor={barBg || AppTheme.Base}
      />
      {!isFlatList ? (
        <ToucableFeedback>
          <View style={[styles.container, customeStyle]}>{children}</View>
        </ToucableFeedback>
      ) : (
        <View style={[styles.container, customeStyle]}>{children}</View>
      )}
      {/* <NoInternet isOffline={true} />
    </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SD.wp(20),
    paddingVertical: Platform.OS == "android" && SD.hp(50),
    // paddingTop: SD.hp(10),
    // padding: SD.hp(10),
    // backgroundColor: 'white',
  },
});
