import {
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
  lightIntensity: number;
  noiseLevel: number;
}

const EnvironmentMonitorScreen = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [environmentData, setEnvironmentData] = useState<EnvironmentData>({
    temperature: 22.5,
    humidity: 45,
    airQuality: 85,
    lightIntensity: 320,
    noiseLevel: 42,
  });

  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    // TODO: Send command to platform to start/stop monitoring
    console.log(`Environmental Monitoring ${isMonitoring ? 'STOPPED' : 'STARTED'}`);
  };

  const handleRefreshData = () => {
    // TODO: Fetch real data from platform sensors
    // Simulate data update
    setEnvironmentData({
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 20,
      airQuality: 70 + Math.random() * 30,
      lightIntensity: 200 + Math.random() * 400,
      noiseLevel: 35 + Math.random() * 30,
    });
    console.log('Environment data refreshed');
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
          lightIntensity: Math.max(0, Math.min(1000, prev.lightIntensity + (Math.random() - 0.5) * 50)),
          noiseLevel: Math.max(20, Math.min(80, prev.noiseLevel + (Math.random() - 0.5) * 10)),
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
      <SectionContainer
        containerStyles={{ 
          marginTop: SD.hp(20), 
          paddingBottom: SD.hp(20),
          paddingHorizontal: SD.wp(15)
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text bold size={20} centered color={AppTheme.Black} bottomSpacing={10}>
              环境数据监测
            </Text>
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
              {renderEnvironmentCard("光照强度", environmentData.lightIntensity.toFixed(0), "lux")}
            </View>
            
            <View style={styles.dataRow}>
              {renderEnvironmentCard("噪音水平", environmentData.noiseLevel.toFixed(0), "dB")}
              <View style={styles.dataCard} /> {/* Empty card for symmetry */}
            </View>
          </View>

          <View style={styles.controlContainer}>
            <PrimaryButton
              title="刷新数据"
              customStyles={[styles.refreshBtn, { backgroundColor: AppTheme.Primary }]}
              onPress={handleRefreshData}
            />
            
            <PrimaryButton
              title={isMonitoring ? '停止监测' : '开始监测'}
              customStyles={[
                styles.toggleBtn,
                { backgroundColor: isMonitoring ? AppTheme.Red : AppTheme.lightGreen }
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