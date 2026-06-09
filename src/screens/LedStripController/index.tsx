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
  advanceOutputSetupHardwareOperation,
  advanceOutputStartHardwareOperation,
  constructNowEvent,
} from '@sensorsparks/platform-api';
import { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { styles } from "./styles";

// WS2812 timing in microseconds: [logic0_total, logic0_duty, logic1_total, logic1_duty]
const WS2812_TIMING = [1.15, 0.35, 1.3, 0.7] as const;

// Color theme map — keys match theme dropdown values
const colorMap = new Map<string, string[]>([
  ['starBlue', ['#00a6fb', '#0582ca', '#006494', '#003554', '#051923']],
  ['mountainGreen', ['#5bba6f', '#3fa34d', '#2a9134', '#137547', '#054a29']],
  ['crimsonRed', ['#ea8c55', '#c75146', '#ad2e24', '#81171b', '#540804']],
  ['colorful', ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']],
]);

function makeRepeated(arr: number[], times: number): number[] {
  return Array.from({ length: times }, () => arr).flat();
}

const availablePins = Array.from({ length: 19 }, (_, i) => ({
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
  const deviceId = route?.params?.id;
  const { AppTheme } = useTheme();
  const [selectedPin, setSelectedPin] = useState<string>("");
  const [selectedCount, setSelectedCount] = useState<string>("");
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  const [loading, setLoading] = useState(false);
  // Track which pin has already been set up; reset when pin changes
  const setupDoneRef = useRef<number | null>(null);

  const sendSetupCommand = async (pin: number) => {
    const opers: any[] = [];
    advanceOutputSetupHardwareOperation(
      opers, pin, 'us',
      WS2812_TIMING[0], WS2812_TIMING[1],
      WS2812_TIMING[2], WS2812_TIMING[3]
    );
    const event = constructNowEvent(opers);
    const ws = WebsocketService.getInstance();
    await ws.executeCommand(deviceId, JSON.stringify(event));
  };

  const sendStartCommand = async (pin: number, colorData: number[], ledNum: number) => {
    const opers: any[] = [];
    advanceOutputStartHardwareOperation(opers, pin, colorData);
    const event = constructNowEvent(opers, ledNum);
    const ws = WebsocketService.getInstance();
    await ws.executeCommand(deviceId, JSON.stringify(event));
  };

  const handleSet = async () => {
    if (!selectedPin || !selectedCount || !selectedTheme) {
      toast.fail('错误', '请填写所有选项');
      return;
    }
    const pin = Number(selectedPin);
    const ledNum = Number(selectedCount);
    const colorCodes = colorMap.get(selectedTheme) ?? [];

    // Build GRB color pattern for WS2812
    const singlePattern: number[] = [];
    colorCodes.forEach((code) => {
      const codeInt = parseInt(code.substring(1), 16);
      const r = (codeInt >> 16) & 0xff;
      const g = (codeInt >> 8) & 0xff;
      const b = codeInt & 0xff;
      singlePattern.push(g, r, b); // WS2812 expects GRB
    });

    const cycle = Math.floor(ledNum / colorCodes.length);
    const colorData = makeRepeated(singlePattern, cycle);

    setLoading(true);
    try {
      if (setupDoneRef.current !== pin) {
        await sendSetupCommand(pin);
        setupDoneRef.current = pin;
      }
      await sendStartCommand(pin, colorData, ledNum);
      toast.success('设置成功');
    } catch (err: any) {
      toast.fail('失败', err?.message ?? '发送指令失败');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (!selectedPin || !selectedCount) {
      toast.fail('错误', '请先选择GPIO和LED数量');
      return;
    }
    const pin = Number(selectedPin);
    const ledNum = Number(selectedCount);
    // All-black (GRB = 0,0,0) to turn off every LED
    const colorData = new Array(ledNum * 3).fill(0);

    setLoading(true);
    try {
      if (setupDoneRef.current !== pin) {
        await sendSetupCommand(pin);
        setupDoneRef.current = pin;
      }
      await sendStartCommand(pin, colorData, ledNum);
      toast.success('已关闭');
    } catch (err: any) {
      toast.fail('失败', err?.message ?? '发送指令失败');
    } finally {
      setLoading(false);
    }
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
          onChange={(v) => {
            setSelectedPin(String(v));
            setupDoneRef.current = null; // pin changed, setup must be re-sent
          }}
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
        {loading ? (
          <ActivityIndicator size="large" color={AppTheme.Primary} />
        ) : (
          <>
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
          </>
        )}
      </View>
    </MainContainer>
  );
};

export default LedStripController;