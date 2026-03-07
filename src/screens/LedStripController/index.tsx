import {
    CustomDropdown,
    MainContainer,
    MainHeader,
    PrimaryButton,
    SectionContainer,
    Text,
} from "@/src/components";
import { useTheme } from "@/src/hooks";
import { useState } from "react";
import { View } from "react-native";
import { styles } from "./styles";

const availablePins = Array.from({ length: 20 }, (_, i) => ({
  label: `GPIO ${i}`,
  value: String(i),
}));

const ledCounts = [
  { label: "50", value: "50" },
  { label: "100", value: "100" },
  { label: "150", value: "150" },
  { label: "200", value: "200" },
];

const themes = [
  { label: "宁静星空蓝", value: "starBlue" },
  { label: "优雅青山绿色", value: "mountainGreen" },
  { label: "热烈绯红色", value: "crimsonRed" },
  { label: "五彩缤纷色", value: "colorful" },
];

const LedStripController = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  const [selectedPin, setSelectedPin] = useState<string>("");
  const [selectedCount, setSelectedCount] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  const handleSet = () => {
    // TODO: Replace with real API call
    console.log("Set LED strip:", { selectedPin, selectedCount, selectedTheme });
  };

  const handleClose = () => {
    // TODO: Replace with real API call to turn off LED strip
    console.log("Close LED strip on pin:", selectedPin);
  };

  const dropdownCommonProps = {
    iconColor: AppTheme.Primary,
    placeholderStyle: { color: AppTheme.Black, fontSize: 14 },
    containerStyle: { backgroundColor: AppTheme.White, borderRadius: 10 },
    activeColor: AppTheme.Primary,
    dropdownStyle: { ...styles.dropdown, backgroundColor: AppTheme.White },
  };

  return (
    <MainContainer>
      <MainHeader
        title="灯带控制器"
        back
        mainContainerStyle={{ paddingVertical: 0 }}
      />

      {/* GPIO selection */}
      <SectionContainer containerStyles={styles.card}>
        <Text bold size={14} color={AppTheme.fontGray} bottomSpacing={12}>
          选择GPIO
        </Text>
        <CustomDropdown
          data={availablePins}
          value={selectedPin}
          onChange={(v) => setSelectedPin(String(v))}
          placeholder="GPIO0"
          {...dropdownCommonProps}
        />
      </SectionContainer>

      {/* LED count */}
      <SectionContainer containerStyles={styles.card}>
        <Text bold size={14} color={AppTheme.fontGray} bottomSpacing={12}>
          LED数量
        </Text>
        <CustomDropdown
          data={ledCounts}
          value={selectedCount}
          onChange={(v) => setSelectedCount(String(v))}
          placeholder="50"
          {...dropdownCommonProps}
        />
      </SectionContainer>

      {/* Theme */}
      <SectionContainer containerStyles={styles.card}>
        <Text bold size={14} color={AppTheme.fontGray} bottomSpacing={12}>
          主题
        </Text>
        <CustomDropdown
          data={themes}
          value={selectedTheme}
          onChange={(v) => setSelectedTheme(String(v))}
          placeholder="宁静星空蓝"
          {...dropdownCommonProps}
        />
      </SectionContainer>

      {/* Action buttons */}
      <View style={styles.buttonsContainer}>
        <PrimaryButton
          title="设置"
          customStyles={[styles.actionBtn, { backgroundColor: AppTheme.Primary }]}
          onPress={handleSet}
        />
        <PrimaryButton
          title="关闭"
          customStyles={[styles.actionBtn, { backgroundColor: AppTheme.LightGray }]}
          onPress={handleClose}
        />
      </View>
    </MainContainer>
  );
};

export default LedStripController;