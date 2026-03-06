import React, { useState } from "react";
import { ImageSourcePropType, Pressable } from "react-native";
import { CustomImage, CustomTouchable, Text } from "../../../../components";
import { Images } from "../../../../config";
import { useTheme } from "../../../../hooks";
import { styles } from "./styles";

type Props = {
  icon: ImageSourcePropType;
  title: string;
  onPress: () => void;
  onRemove?: () => void;
  isRemovable?: boolean;
};

const PrinterSettingScreenCard: React.FC<Props> = ({
  icon,
  title,
  onPress,
  onRemove,
  isRemovable = false,
}) => {
  const { AppTheme } = useTheme();
  const [showRemoveButton, setShowRemoveButton] = useState(false); // Start hidden

  const toggleRemoveButton = () => {
    setShowRemoveButton(!showRemoveButton);
  };

  const handleCardPress = () => {
    if (showRemoveButton) {
      // If RemoveComp is visible, hide it instead of triggering card action
      setShowRemoveButton(false);
    } else {
      // If RemoveComp is hidden, trigger the original onPress action
      onPress();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
      setShowRemoveButton(false); // Hide the remove button after removal
    }
  };

  return (
    <CustomTouchable
      onPress={handleCardPress}
      style={[styles.cardContainer, { backgroundColor: AppTheme.skyBlue }]}
    >
      {/* Top right controls container - only show for removable items */}
      {isRemovable && (
        <Pressable onPress={toggleRemoveButton} style={styles.verticalDotsContainer}>
          <CustomImage
            source={Images.verticalDots}
            style={styles.verticalDots}
          />
        </Pressable>
      )}
      {showRemoveButton && isRemovable && <RemoveComp handleRemove={handleRemove} />}

      {/* Main content */}
      <CustomImage source={icon} style={styles.cardIcon} />
      <Text bold size={12} topSpacing={10} centered color={AppTheme.Black}>
        {title}
      </Text>
    </CustomTouchable>
  );
};

const RemoveComp = ({ handleRemove }) => {
  const { AppTheme } = useTheme();
  return (
    <Pressable style={styles.removeCompContainer} onPress={handleRemove}>
      <CustomImage
        source={Images.bin}
        style={[styles.binIcon, { backgroundColor: "#FFFFFF" }]}
      />
      <Text regular size={12}>
        Remove
      </Text>
    </Pressable>
  );
};

export default PrinterSettingScreenCard;
