import { CustomImage, SectionContainer, Text } from "../../../../components";
import { useTheme } from "../../../../hooks";
import { styles } from "./styles";

export function MainScreenOptionsCard({ icon, heading, subHeading, onPress }) {
  const { AppTheme } = useTheme();
  return (
    <SectionContainer
      containerStyles={styles.mainScreenOptionCard}
      onPress={onPress}
    >
      <CustomImage source={icon} style={styles.cardIcon} />
      <Text bold size={12} centered bottomSpacing={0} color={AppTheme.Black}>
        {heading}
      </Text>
      <Text regular size={10} color={AppTheme.fontGray} centered topSpacing={5}>
        {subHeading}
      </Text>
    </SectionContainer>
  );
}
