import { ImageSourcePropType, StyleSheet, View } from "react-native";
import Text from "../text";
import React from "react";
import { CardContainer } from "../card-container";
import { CustomImage } from "../custom-image";
import { Images } from "../../config";
import { SD } from "../../utils";
import { useTheme } from "../../hooks";

type EmptyStateProps = {
  icon?: ImageSourcePropType;
  heading?: string;
  subHeading?: string;
  isActive?: boolean;
  circle?: boolean;
  onPress?: () => void;
  containerStyles?: any;
  isCurrent?: any;
};
export const ParingConnectionCard: React.FC<EmptyStateProps> = ({
  icon,
  heading,
  subHeading,
  isActive,
  circle,
  onPress,
  containerStyles,
  isCurrent,
}) => {
  const { AppTheme } = useTheme();
  return (
    <CardContainer
      customStyles={{
        ...styles.cardContainer,
        ...containerStyles,
        backgroundColor: isActive
          ? AppTheme.Primary
          : isCurrent
          ? AppTheme.disableGray
          : AppTheme.White,
      }}
      onPress={onPress}
    >
      <View
        style={[
          styles.cardIconView,
          { backgroundColor: isActive ? AppTheme.White : AppTheme.skyBlue },
        ]}
      >
        <CustomImage source={icon} style={styles.cardIcon} />
      </View>
      <View style={styles.cardTextView}>
        <Text bold size={12} color={isActive ? AppTheme.White : AppTheme.Black}>
          {heading}
        </Text>
        <Text
          regular
          size={10}
          color={isActive ? AppTheme.White : AppTheme.Black}
        >
          {subHeading}
        </Text>
      </View>
      {circle ? (
        <CircleOption isActive={isActive} />
      ) : !isActive ? (
        <CustomImage source={Images.rightArrow} style={styles.rightArrowIcon} />
      ) : null}
    </CardContainer>
  );
};

const CircleOption = ({ isActive }) => {
  const { AppTheme } = useTheme();
  return (
    <View
      style={[
        styles.circleView,
        {
          backgroundColor: isActive ? AppTheme.Primary : AppTheme.skyBlue,
          borderColor: isActive ? AppTheme.White : AppTheme.skyBlue,
          borderWidth: 3,
          borderRadius: 100,
          width: SD.wp(16),
          height: SD.hp(16),
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingHorizontal: SD.wp(10),
    paddingVertical: SD.hp(10),
    height: SD.hp(48),
    // justifyContent: "space-between",
    marginTop: SD.hp(10),
  },
  cardIconView: {
    width: SD.wp(40),
    height: SD.hp(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  cardIcon: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  cardTextView: {
    marginLeft: SD.wp(10),
    flex: 1,
  },
  circleView: {
    // borderWidth: 10,
  },
  rightArrowIcon: {
    width: SD.wp(8),
    height: SD.hp(12),
    resizeMode: "contain",
    right: SD.wp(10),
  },
});
