import {
    CustomDropdown,
    MainContainer,
    MainHeader,
    PrimaryButton,
    SectionContainer,
    Text,
} from "@/src/components";
import { useTheme } from "@/src/hooks";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SD } from "../../utils";
import { styles } from "./styles";

interface EnvironmentData {
  temperature: number;
  humidity: number;
  airQuality: number;
}

const availablePins = Array.from({ length: 20 }, (_, i) => ({
  label: `GPIO ${i}`,
  value: String(i),
}));

const EnvironmentMonitorScreen = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  const [selectedPin, setSelectedPin] = useState<string>("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [environmentData, setEnvironmentData] = useState<EnvironmentData>({
    temperature: 22.5,
    humidity: 45,
    airQuality: 85,
  });

  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    // TODO: Send command to platform to start/stop monitoring
    console.log(`Environmental Monitoring ${isMonitoring ? 'STOPPED' : 'STARTED'}`);
  };

  // Simulate real-time updates when monitoring is active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        setEnvironmentData(prev => ({
          temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
          humidity: Math.max(20, Math.min(80, prev.humidity + (Math.random() - 0.5) * 5)),
          airQuality: Math.max(50, Math.min(100, prev.airQuality + (Math.random() - 0.5) * 5)),
        }));
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const getAirQualityStatus = (value: number) => {
    if (value >= 90) return { text: "优秀", color: AppTheme.lightGreen };
    if (value >= 70) return { text: "良好", color: AppTheme.Yellow };
    if (value >= 50) return { text: "一般", color: AppTheme.Red };
    return { text: "差", color: AppTheme.Red };
  };

  const renderEnvironmentCard = (title: string, value: string, unit: string, status?: { text: string; color: string }) => (
    <View style={[styles.dataCard, { backgroundColor: AppTheme.White }]}>
      <Text bold size={14} color={AppTheme.fontGray} bottomSpacing={5}>
        {title}
      </Text>
      <Text bold size={24} color={AppTheme.Black} bottomSpacing={5}>
        {value} <Text size={16} color={AppTheme.fontGray}>{unit}</Text>
      </Text>
      {status && (
        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
          <Text bold size={12} color={AppTheme.White}>
            {status.text}
          </Text>
        </View>
      )}
    </View>
  );

  const airQualityStatus = getAirQualityStatus(environmentData.airQuality);

  return (
    <MainContainer>
      <MainHeader
        title="环境监测应用"
        back
        mainContainerStyle={{
          paddingVertical: 0,
        }}
      />
      {/* GPIO selection card */}
      <SectionContainer
        containerStyles={{
          marginTop: SD.hp(50),
          paddingVertical: SD.hp(20),
          paddingHorizontal: SD.wp(20),
        }}
      >
        <Text bold size={14} color={AppTheme.fontGray} bottomSpacing={12}>
          选择GPIO
        </Text>
        <CustomDropdown
          data={availablePins}
          value={selectedPin}
          onChange={(v) => setSelectedPin(String(v))}
          placeholder="GPIO0"
          dropdownStyle={{ ...styles.dropdown, backgroundColor: AppTheme.White }}
          iconColor={AppTheme.Primary}
          placeholderStyle={{ color: AppTheme.Black, fontSize: 14 }}
          containerStyle={{ backgroundColor: AppTheme.White, borderRadius: 10 }}
          activeColor={AppTheme.Primary}
        />
      </SectionContainer>

      <SectionContainer
        containerStyles={{ 
          marginTop: SD.hp(20), 
          paddingBottom: SD.hp(20),
          paddingHorizontal: SD.wp(15)
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <View style={styles.statusContainer}>
              <Text bold size={16} color={AppTheme.Black}>
                监测状态: 
              </Text>
              <View style={[
                styles.statusIndicator, 
                { backgroundColor: isMonitoring ? AppTheme.lightGreen : AppTheme.fontGray }
              ]}>
                <Text bold size={14} color={AppTheme.White}>
                  {isMonitoring ? '运行中' : '已停止'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.dataContainer}>
            <View style={styles.dataRow}>
              {renderEnvironmentCard("温度", environmentData.temperature.toFixed(1), "°C")}
              {renderEnvironmentCard("湿度", environmentData.humidity.toFixed(0), "%")}
            </View>
            
            <View style={styles.dataRow}>
              {renderEnvironmentCard("空气质量", environmentData.airQuality.toFixed(0), "AQI", airQualityStatus)}
            </View>
          </View>

          <View style={styles.controlContainer}>
            <PrimaryButton
              title={isMonitoring ? '停止监测' : '开始监测'}
              customStyles={[
                styles.toggleBtn,
                { backgroundColor: isMonitoring ? AppTheme.LightGray : AppTheme.Primary }
              ]}
              onPress={handleToggleMonitoring}
            />
          </View>
        </ScrollView>
      </SectionContainer>
    </MainContainer>
  );
};

export default EnvironmentMonitorScreen;