import {
    MainContainer,
    MainHeader,
    PrimaryButton,
    SectionContainer,
    Text,
} from "@/src/components";
import { useTheme } from "@/src/hooks";
import { useState } from "react";
import { View } from "react-native";
import { SD } from "../../utils";
import { styles } from "./styles";

const LedStripController = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  const [isLedOn, setIsLedOn] = useState(false);
  const [brightness, setBrightness] = useState(50);

  const handleToggleLed = () => {
    setIsLedOn(!isLedOn);
    // TODO: Send command to platform to toggle LED
    console.log(`LED ${isLedOn ? 'OFF' : 'ON'}`);
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    // TODO: Send command to platform to change brightness
    console.log(`Brightness: ${value}%`);
  };

  return (
    <MainContainer>
      <MainHeader
        title="灯带控制器"
        back
        mainContainerStyle={{
          paddingVertical: 0,
        }}
      />
      <SectionContainer
        containerStyles={{ 
          marginTop: SD.hp(50), 
          paddingBottom: SD.hp(20),
          paddingHorizontal: SD.wp(20)
        }}
      >
        <View style={styles.controlContainer}>
          <Text bold size={20} centered color={AppTheme.Black} bottomSpacing={30}>
            LED灯带状态控制
          </Text>
          
          <View style={styles.statusContainer}>
            <Text bold size={16} color={AppTheme.Black} bottomSpacing={10}>
              当前状态: 
            </Text>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: isLedOn ? AppTheme.lightGreen : AppTheme.fontGray }
            ]}>
              <Text bold size={14} color={AppTheme.White}>
                {isLedOn ? '开启' : '关闭'}
              </Text>
            </View>
          </View>

          <View style={styles.brightnessContainer}>
            <Text bold size={16} color={AppTheme.Black} bottomSpacing={10}>
              亮度: {brightness}%
            </Text>
            <View style={styles.brightnessControls}>
              <PrimaryButton
                title="-"
                customStyles={[styles.brightnessBtn, { backgroundColor: AppTheme.fontGray }]}
                onPress={() => handleBrightnessChange(Math.max(0, brightness - 10))}
                disabled={brightness <= 0}
              />
              <View style={styles.brightnessDisplay}>
                <View style={[
                  styles.brightnessBar,
                  { width: `${brightness}%`, backgroundColor: AppTheme.Primary }
                ]} />
              </View>
              <PrimaryButton
                title="+"
                customStyles={[styles.brightnessBtn, { backgroundColor: AppTheme.Primary }]}
                onPress={() => handleBrightnessChange(Math.min(100, brightness + 10))}
                disabled={brightness >= 100}
              />
            </View>
          </View>

          <PrimaryButton
            title={isLedOn ? '关闭LED' : '开启LED'}
            customStyles={[
              styles.toggleBtn,
              { backgroundColor: isLedOn ? AppTheme.Red : AppTheme.lightGreen }
            ]}
            onPress={handleToggleLed}
          />
        </View>
      </SectionContainer>
    </MainContainer>
  );
};

export default LedStripController;