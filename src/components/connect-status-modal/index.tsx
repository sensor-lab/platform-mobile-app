import { View } from "react-native";
import { useTheme } from "../../hooks";
import { SD } from "../../utils";
import { CustomImage } from "../custom-image";
import CustomModal from "../custom-modal";
import { PrimaryButton } from "../primary-button";
import Text from "../text";
import { styles } from "./styles";

export const ConnectionStatusModal = ({
  isVisible,
  onClose,
  icon,
  title,
  description,
  onRetry,
}) => {
  const { AppTheme } = useTheme();
  return (
    <CustomModal isVisible={isVisible}>
      <View
        style={{ ...styles.modalContainer, backgroundColor: AppTheme.White }}
      >
        <CustomImage source={icon} style={styles.deviceIcon} />
        <Text bold size={18} color={AppTheme.Black} centered>
          {title}
        </Text>
        <Text
          regular
          size={14}
          color={AppTheme.fontGray}
          centered
          width={270}
          topSpacing={20}
          bottomSpacing={20}
        >
          {description}
        </Text>
        <View style={styles.modalBtnsView}>
          <PrimaryButton
            title="取消"
            customStyles={{
              flex: 2,
              marginHorizontal: SD.wp(5),
              borderRadius: 15,
            }}
            onPress={onClose}
          />
          <PrimaryButton
            title="重试"
            customStyles={{ flex: 2, borderRadius: 15 }}
            onPress={onRetry}
          />
        </View>
      </View>
    </CustomModal>
  );
};
