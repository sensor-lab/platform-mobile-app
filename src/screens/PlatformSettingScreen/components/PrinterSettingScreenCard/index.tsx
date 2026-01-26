import { ImageSourcePropType, View } from "react-native";
import { CustomImage, CustomTouchable, Text } from "../../../../components";
import { styles } from "./styles";
import { Images } from "../../../../config";
import { useTheme } from "../../../../hooks";
import React from "react";

type Props = {
  icon: ImageSourcePropType;
  title: string;
  onPress: () => void;
};

const PrinterSettingScreenCard: React.FC<Props> = ({
  icon,
  title,
  onPress,
}) => {
  const { AppTheme } = useTheme();
  return (
    <CustomTouchable
      onPress={onPress}
      style={[styles.cardContainer, { backgroundColor: AppTheme.skyBlue }]}
    >
      <CustomImage source={icon} style={styles.cardIcon} />
      <Text bold size={12} topSpacing={10} centered color={AppTheme.Black}>
        {title}
      </Text>
    </CustomTouchable>
  );
};

export default PrinterSettingScreenCard;
