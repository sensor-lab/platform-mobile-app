import React from "react";
import {
  SafeAreaView,
  View,
  ViewStyle,
  Pressable,
  Text,
  Platform,
} from "react-native";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { CustomImage } from "../custom-image";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SD } from "../../utils";

type BackHeaderProps = {
  back?: boolean;
  btnFunction?: () => void;
  mainContainerStyle?: ViewStyle;
  logo?: boolean;
  title?: string;
  showPlusIcon?: boolean;
};

export const MainHeader: React.FC<BackHeaderProps> = ({
  mainContainerStyle,
  logo,
  back,
  title,
  showPlusIcon,
}) => {
  const { AppTheme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handleGoBack = () => navigation.goBack();
  const handleAddPrinter = () =>
    navigation.navigate(ScreenNames.PrinterSetupScreen);

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
      {logo && (
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            top: Platform.OS == "android" ? SD.hp(10) : 0,
          }}
        >
          <CustomImage source={Images.logo} style={styles.logoStyles} />
          {showPlusIcon && (
            <Pressable onPress={handleAddPrinter}>
              <CustomImage source={Images.plusIcon} style={styles.plusIcon} />
            </Pressable>
          )}
        </View>
      )}
      {back && (
        <View
          style={[
            styles.backHeader,
            mainContainerStyle,
            Platform.OS == "android" && { paddingTop: SD.hp(10) },
          ]}
        >
          <Pressable onPress={handleGoBack}>
            <CustomImage source={Images.BackBtn} style={styles.backIcon} />
          </Pressable>
          {title && <Text style={styles.headerTitle}>{title}</Text>}
        </View>
      )}
    </SafeAreaView>
  );
};
