import {
  CustomDropdown,
  MainContainer,
  MainHeader,
  SectionContainer,
  Text,
} from "@/src/components";
import { useTheme } from "@/src/hooks";
import { WebsocketService } from "@/src/services/payload_service";
import { toast } from "@/src/utils/toast.utils";
import {
  constructNowEvent,
  gpioHardwareOperation,
} from '@sensorsparks/platform-api';
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  View,
} from "react-native";
import { SD } from "../../utils";
import { styles } from "./styles";

type PinMode = "input" | "output";

// GPIO pins 0-19
const availablePins = Array.from({ length: 20 }, (_, i) => ({
  label: `GPIO ${i}`,
  value: String(i),
}));

const fetchGpioStatus = async (id: string, pin: string): Promise<boolean> => {
  const opers: any[] = [];
  gpioHardwareOperation(opers, Number(pin), "input", 0); // does not have pullup resistor
  const event = constructNowEvent(opers);
  const ws = WebsocketService.getInstance();
  const resp = await ws.executeCommand(id, JSON.stringify(event));
  return JSON.parse(resp)["result"][0][0] === 1;
};

// Set GPIO output level via WebSocket hardware operation
const setGpioOutput = async (id: string, pin: string, high: boolean): Promise<boolean> => {
  const opers: any[] = [];
  gpioHardwareOperation(opers, Number(pin), "output", high ? 1 : 0);
  const event = constructNowEvent(opers);
  const ws = WebsocketService.getInstance();
  await ws.executeCommand(id, JSON.stringify(event));
  return high;
};

// ─── Large animated toggle ────────────────────────────────────────────────────
const TRACK_HEIGHT = SD.hp(90);
const THUMB_SIZE = SD.hp(78);
const THUMB_MARGIN = (TRACK_HEIGHT - THUMB_SIZE) / 2;

const LargeToggle = ({
  value,
  onToggle,
  disabled,
}: {
  value: boolean;
  onToggle: () => void;
  disabled: boolean;
}) => {
  const { AppTheme } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start();
  }, [value, animValue]);

  const thumbLeft =
    trackWidth > 0
      ? animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [
          THUMB_MARGIN,
          trackWidth - THUMB_SIZE - THUMB_MARGIN,
        ],
      })
      : THUMB_MARGIN;

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onToggle}
      activeOpacity={disabled ? 1 : 0.85}
    >
      <Animated.View
        style={[
          styles.toggleTrack,
          { backgroundColor: value ? "#7ED321" : AppTheme.disableGray },
        ]}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={[
            styles.toggleThumb,
            { top: THUMB_MARGIN, left: thumbLeft },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────
const PowerControllerScreen = ({ navigation, route }) => {
  const deviceId = route?.params?.id;
  const { AppTheme } = useTheme();
  const [selectedPin, setSelectedPin] = useState<string>("");
  const [pinMode, setPinMode] = useState<PinMode | null>(null);
  const [pinHigh, setPinHigh] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePinChange = useCallback((pin: string | number) => {
    setSelectedPin(String(pin));
    setPinMode(null);
    setPinHigh(false);
  }, []);

  const handleModeSelect = useCallback(
    async (mode: PinMode) => {
      setPinMode(mode);
      setPinHigh(false);
      if (mode === "input") {
        setLoading(true);
        try {
          const status = await fetchGpioStatus(deviceId, selectedPin);
          setPinHigh(status);
        } catch {
          setPinHigh(false);
        } finally {
          setLoading(false);
        }
      }
    },
    [deviceId, selectedPin, pinMode],
  );

  const handleToggle = useCallback(async () => {
    if (pinMode !== "output" || !selectedPin) return;
    setLoading(true);
    try {
      const result = await setGpioOutput(deviceId, selectedPin, !pinHigh);
      setPinHigh(result);
      toast.success("发送成功");
    } catch {
      toast.fail("失败", "发送硬件操作失败");
    } finally {
      setLoading(false);
    }
  }, [deviceId, selectedPin, pinHigh, pinMode]);

  return (
    <MainContainer>
      <MainHeader
        title="电源控制器"
        back
        mainContainerStyle={{ paddingVertical: 0 }}
      />

      {/* ── GPIO selection card ── */}
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
          onChange={handlePinChange}
          placeholder="GPIO0"
          dropdownStyle={{
            ...styles.dropdown,
            backgroundColor: AppTheme.White,
          }}
          iconColor={AppTheme.Primary}
          placeholderStyle={{ color: AppTheme.Black, fontSize: 14 }}
          containerStyle={{ backgroundColor: AppTheme.White, borderRadius: 10 }}
          activeColor={AppTheme.Primary}
        />
      </SectionContainer>

      {/* ── Input / Output segmented control ── */}
      {selectedPin !== "" && (
        <SectionContainer containerStyles={{ marginTop: SD.hp(20), padding: 0, paddingBottom: SD.hp(10) }}>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeBtn,
                styles.modeBtnLeft,
                {
                  backgroundColor:
                    pinMode === "input" ? AppTheme.Primary : "#D6DCE8",
                },
              ]}
              onPress={() => handleModeSelect("input")}
            >
              <Text
                bold
                size={16}
                color={
                  pinMode === "input" ? AppTheme.White : AppTheme.Black
                }
              >
                输入
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeBtn,
                styles.modeBtnRight,
                {
                  backgroundColor:
                    pinMode === "output" ? AppTheme.Primary : "#D6DCE8",
                },
              ]}
              onPress={() => handleModeSelect("output")}
            >
              <Text
                bold
                size={16}
                color={
                  pinMode === "output" ? AppTheme.White : AppTheme.Black
                }
              >
                输出
              </Text>
            </TouchableOpacity>
          </View>
        </SectionContainer>
      )}

      {/* ── Level display + toggle card ── */}
      {pinMode !== null && (
        <SectionContainer
          containerStyles={{
            marginTop: SD.hp(20),
            paddingVertical: SD.hp(25),
            paddingHorizontal: SD.wp(20),
          }}
        >
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={AppTheme.Primary} />
            </View>
          ) : (
            <>
              <Text bold size={18} color={AppTheme.Black} bottomSpacing={20}>
                {pinHigh ? "高电平" : "低电平"}
              </Text>
              <LargeToggle
                value={pinHigh}
                onToggle={handleToggle}
                disabled={pinMode === "input"}
              />
            </>
          )}
        </SectionContainer>
      )}
    </MainContainer>
  );
};

export default PowerControllerScreen;