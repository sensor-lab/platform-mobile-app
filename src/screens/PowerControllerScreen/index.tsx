import {
    MainContainer,
    MainHeader,
    PrimaryButton,
    SectionContainer,
    Text,
    CustomDropdown,
} from "@/src/components";
import { useTheme } from "@/src/hooks";
import { useState } from "react";
import { View, Alert } from "react-native";
import { SD } from "../../utils";
import { styles } from "./styles";

// Available GPIO pins for power control
const availablePins = [
  { label: "引脚 2 (GPIO2)", value: "2" },
  { label: "引脚 4 (GPIO4)", value: "4" },
  { label: "引脚 5 (GPIO5)", value: "5" },
  { label: "引脚 12 (GPIO12)", value: "12" },
  { label: "引脚 13 (GPIO13)", value: "13" },
  { label: "引脚 14 (GPIO14)", value: "14" },
  { label: "引脚 15 (GPIO15)", value: "15" },
  { label: "引脚 16 (GPIO16)", value: "16" },
  { label: "引脚 17 (GPIO17)", value: "17" },
  { label: "引脚 18 (GPIO18)", value: "18" },
  { label: "引脚 19 (GPIO19)", value: "19" },
  { label: "引脚 21 (GPIO21)", value: "21" },
  { label: "引脚 22 (GPIO22)", value: "22" },
  { label: "引脚 23 (GPIO23)", value: "23" },
];

const PowerControllerScreen = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [pinStates, setPinStates] = useState<Record<string, boolean>>({});
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(!isConnected);
    // TODO: Send command to platform to connect/disconnect power controller
    console.log(`Power Controller ${isConnected ? 'Disconnected' : 'Connected'}`);
    if (!isConnected) {
      Alert.alert("成功", "电源控制器已连接");
    } else {
      Alert.alert("提示", "电源控制器已断开");
      setPinStates({});
    }
  };

  const handleSetPinState = (state: boolean) => {
    if (!selectedPin) {
      Alert.alert("错误", "请先选择引脚");
      return;
    }
    if (!isConnected) {
      Alert.alert("错误", "请先连接电源控制器");
      return;
    }

    setPinStates(prev => ({
      ...prev,
      [selectedPin]: state
    }));

    // TODO: Send command to platform to set pin state
    console.log(`Setting Pin ${selectedPin} to ${state ? 'HIGH' : 'LOW'}`);
    Alert.alert("成功", `引脚 ${selectedPin} 已设置为 ${state ? '高电平 (3.3V)' : '低电平 (0V)'}`);
  };

  const getCurrentPinState = () => {
    if (!selectedPin) return null;
    return pinStates[selectedPin];
  };

  const handleResetAllPins = () => {
    if (!isConnected) {
      Alert.alert("错误", "请先连接电源控制器");
      return;
    }

    Alert.alert(
      "确认重置",
      "确定要将所有引脚重置为低电平吗？",
      [
        { text: "取消", style: "cancel" },
        {
          text: "确定",
          onPress: () => {
            setPinStates({});
            // TODO: Send command to platform to reset all pins
            console.log("Resetting all pins to LOW");
            Alert.alert("成功", "所有引脚已重置为低电平");
          }
        }
      ]
    );
  };

  return (
    <MainContainer>
      <MainHeader
        title="电源控制器"
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
            GPIO引脚电源控制
          </Text>
          
          <View style={styles.statusContainer}>
            <Text bold size={16} color={AppTheme.Black} bottomSpacing={10}>
              控制器状态: 
            </Text>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: isConnected ? AppTheme.lightGreen : AppTheme.fontGray }
            ]}>
              <Text bold size={14} color={AppTheme.White}>
                {isConnected ? '已连接' : '未连接'}
              </Text>
            </View>
          </View>

          <PrimaryButton
            title={isConnected ? '断开控制器' : '连接控制器'}
            customStyles={[
              styles.connectBtn,
              { backgroundColor: isConnected ? AppTheme.Red : AppTheme.Primary }
            ]}
            onPress={handleConnect}
          />

          <View style={styles.pinSelectionContainer}>
            <Text bold size={16} color={AppTheme.Black} bottomSpacing={15}>
              选择引脚:
            </Text>
            <CustomDropdown
              data={availablePins}
              value={selectedPin}
              onChange={setSelectedPin}
              placeholder="选择GPIO引脚"
              dropdownStyle={[
                styles.dropdown,
                { backgroundColor: AppTheme.skyBlue }
              ]}
              iconColor={AppTheme.Primary}
              placeholderStyle={{
                color: AppTheme.fontGray,
                fontSize: 14,
              }}
              containerStyle={{
                backgroundColor: AppTheme.skyBlue,
              }}
              activeColor={AppTheme.White}
            />
          </View>

          {selectedPin && (
            <View style={styles.pinStatusContainer}>
              <Text bold size={16} color={AppTheme.Black} bottomSpacing={10}>
                引脚 {selectedPin} 当前状态:
              </Text>
              <View style={[
                styles.statusIndicator,
                { 
                  backgroundColor: getCurrentPinState() === true 
                    ? AppTheme.lightGreen 
                    : getCurrentPinState() === false 
                    ? AppTheme.Red 
                    : AppTheme.fontGray 
                }
              ]}>
                <Text bold size={14} color={AppTheme.White}>
                  {getCurrentPinState() === true 
                    ? '高电平 (3.3V)' 
                    : getCurrentPinState() === false 
                    ? '低电平 (0V)' 
                    : '未设置'}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.controlButtonsContainer}>
            <PrimaryButton
              title="设置高电平 (HIGH)"
              customStyles={[
                styles.controlBtn,
                { 
                  backgroundColor: AppTheme.lightGreen,
                  opacity: selectedPin && isConnected ? 1 : 0.6
                }
              ]}
              onPress={() => handleSetPinState(true)}
              disabled={!selectedPin || !isConnected}
            />

            <PrimaryButton
              title="设置低电平 (LOW)"
              customStyles={[
                styles.controlBtn,
                { 
                  backgroundColor: AppTheme.Red,
                  opacity: selectedPin && isConnected ? 1 : 0.6
                }
              ]}
              onPress={() => handleSetPinState(false)}
              disabled={!selectedPin || !isConnected}
            />
          </View>

          <PrimaryButton
            title="重置所有引脚"
            customStyles={[
              styles.resetBtn,
              { 
                backgroundColor: AppTheme.Yellow,
                opacity: isConnected ? 1 : 0.6
              }
            ]}
            onPress={handleResetAllPins}
            disabled={!isConnected}
          />

          {Object.keys(pinStates).length > 0 && (
            <View style={styles.activePinsContainer}>
              <Text bold size={16} color={AppTheme.Black} bottomSpacing={10}>
                活跃引脚状态:
              </Text>
              <View style={styles.activePinsList}>
                {Object.entries(pinStates).map(([pin, state]) => (
                  <View key={pin} style={styles.activePinItem}>
                    <Text regular size={12} color={AppTheme.Black}>
                      引脚 {pin}: 
                    </Text>
                    <Text 
                      bold 
                      size={12} 
                      color={state ? AppTheme.lightGreen : AppTheme.Red}
                    >
                      {state ? 'HIGH' : 'LOW'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </SectionContainer>
    </MainContainer>
  );
};

export default PowerControllerScreen;