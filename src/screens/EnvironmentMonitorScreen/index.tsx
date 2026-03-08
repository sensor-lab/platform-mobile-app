import {
    CustomDropdown,
    MainContainer,
    MainHeader,
    PrimaryButton,
    SectionContainer,
    Text,
} from "@/src/components";
import { useTheme } from "@/src/hooks";
import { WebsocketService } from "@/src/services/payload_service";
import { toast } from "@/src/utils/toast.utils";
import {
    constructNowEvent,
    i2cReadHardwareOperation,
    i2cWriteHardwareOperation,
} from '@sensorsparks/platform-api';
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { SD } from "../../utils";
import { styles } from "./styles";

interface EnvironmentData {
  temperature: number;
  humidity: number;
  airQuality: number;
}

// SDA can be GPIO 0-18; SCL is automatically SDA + 1
const availablePins = Array.from({ length: 19 }, (_, i) => ({
  label: `GPIO ${i}`,
  value: String(i),
}));

const I2C_SPEED_KHZ = 10;
const SHT30_I2C_ADDR = 68;
const MTS01_I2C_ADDR = 69;
const AGS02MA_I2C_ADDR = 26;

async function executeI2COperation(deviceId: string, event: any): Promise<any> {
  const ws = new WebsocketService();
  try {
    await ws.connect();
    const resp = await ws.executeCommand(deviceId, JSON.stringify(event));
    return JSON.parse(resp);
  } finally {
    ws.close();
  }
}

async function startSht30SingleShot(deviceId: string, sda_pin: number, scl_pin: number): Promise<void> {
  const opers: any[] = [];
  i2cWriteHardwareOperation(opers, sda_pin, scl_pin, I2C_SPEED_KHZ, SHT30_I2C_ADDR, 36, 11);
  const event = constructNowEvent(opers);
  const response = await executeI2COperation(deviceId, event);
  if (response === undefined) throw new Error('和平台通信失败，请重启平台');
  if (response.errorcode !== 0) throw new Error('和环境模块通信失败，请检查连接和引脚号');
}

async function readSht30Humidity(deviceId: string, sda_pin: number, scl_pin: number): Promise<number> {
  const opers: any[] = [];
  i2cReadHardwareOperation(opers, sda_pin, scl_pin, I2C_SPEED_KHZ, SHT30_I2C_ADDR, -1, -1, 6);
  const event = constructNowEvent(opers);
  const response = await executeI2COperation(deviceId, event);
  if (response === undefined) throw new Error('和平台通信失败，请重启平台');
  if (response.errorcode !== 0) throw new Error('和环境模块通信失败，请检查连接和引脚号');
  return 100.0 * (((response['result'][0][3] << 8) + response['result'][0][4]) / 65535);
}

async function readMts01Temperature(deviceId: string, sda_pin: number, scl_pin: number): Promise<number> {
  const opers: any[] = [];
  i2cWriteHardwareOperation(opers, sda_pin, scl_pin, I2C_SPEED_KHZ, MTS01_I2C_ADDR, 204, 68);
  i2cReadHardwareOperation(opers, sda_pin, scl_pin, I2C_SPEED_KHZ, MTS01_I2C_ADDR, -1, -1, 3);
  const event = constructNowEvent(opers);
  const response = await executeI2COperation(deviceId, event);
  if (response === undefined) throw new Error('和平台通信失败，请重启平台');
  if (response.errorcode !== 0) throw new Error('和环境模块通信失败，请检查连接和引脚号');
  let temp_val = (response['result'][1][0] << 8) + response['result'][1][1];
  if ((temp_val & (1 << 15)) !== 0) temp_val = temp_val - (1 << 16);
  return 40 + temp_val / 256;
}

async function readAgs02maAirQuality(deviceId: string, sda_pin: number, scl_pin: number): Promise<number> {
  const opers: any[] = [];
  i2cWriteHardwareOperation(opers, sda_pin, scl_pin, I2C_SPEED_KHZ, AGS02MA_I2C_ADDR, 0);
  i2cReadHardwareOperation(opers, sda_pin, scl_pin, I2C_SPEED_KHZ, AGS02MA_I2C_ADDR, -1, -1, 5);
  const event = constructNowEvent(opers);
  const response = await executeI2COperation(deviceId, event);
  if (response === undefined) throw new Error('和平台通信失败，请重启平台');
  if (response.errorcode !== 0) throw new Error('和环境模块通信失败，请检查连接和引脚号');
  return (
    (response['result'][1][0] << 24) +
    (response['result'][1][1] << 16) +
    (response['result'][1][2] << 8) +
    response['result'][1][3]
  );
}

const EnvironmentMonitorScreen = ({ navigation, route }) => {
  const deviceId = route?.params?.id;
  const { AppTheme } = useTheme();
  const [selectedPin, setSelectedPin] = useState<string>("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const pollingRef = useRef(false);
  const [environmentData, setEnvironmentData] = useState<EnvironmentData>({
    temperature: 0,
    humidity: 0,
    airQuality: 0,
  });

  const handleToggleMonitoring = () => {
    if (!isMonitoring && !selectedPin) {
      toast.fail('错误', '请先选择GPIO引脚');
      return;
    }
    setIsMonitoring(prev => !prev);
  };

  useEffect(() => {
    if (!isMonitoring || !selectedPin) return;
    const sda = Number(selectedPin);
    const scl = sda + 1;

    const poll = async () => {
      if (pollingRef.current) return;
      pollingRef.current = true;
      try {
        await startSht30SingleShot(deviceId, sda, scl);
        await new Promise(r => setTimeout(r, 50));
        const humidity = await readSht30Humidity(deviceId, sda, scl);
        const temperature = await readMts01Temperature(deviceId, sda, scl);
        const airQuality = await readAgs02maAirQuality(deviceId, sda, scl);
        setEnvironmentData({ temperature, humidity, airQuality });
      } catch (err: any) {
        toast.fail('失败', err?.message ?? '读取传感器数据失败');
        setIsMonitoring(false);
      } finally {
        pollingRef.current = false;
      }
    };

    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [isMonitoring, selectedPin, deviceId]);

  const getAirQualityStatus = (value: number) => {
    if (value <= 300) return { text: "优良", color: AppTheme.lightGreen };
    if (value <= 1500) return { text: "微量污染", color: AppTheme.Yellow };
    if (value <= 3000) return { text: "轻度污染", color: AppTheme.Yellow };
    if (value <= 5000) return { text: "中度污染", color: AppTheme.Red };
    return { text: "重度污染", color: AppTheme.Red };
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
          选择SDA引脚 (SCL 自动为下一个引脚)
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
              {renderEnvironmentCard("空气质量", environmentData.airQuality.toFixed(0), "ppb", airQualityStatus)}
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