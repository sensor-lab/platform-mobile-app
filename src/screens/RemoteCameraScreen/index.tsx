import {
    MainContainer,
    MainHeader,
    PrimaryButton,
    Text,
} from "@/src/components";
import { WebsocketService } from "@/src/services/payload_service";
import { toast } from "@/src/utils/toast.utils";
import {
    constructNowEvent,
    dvpCaptureHardwareOperation,
    dvpReadHardwareOperation,
    dvpResetHardwareOperation,
    dvpSetHardwareOperation,
} from '@sensorsparks/platform-api';
import { Buffer } from 'buffer';
import { useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { styles } from "./styles";

// Fixed camera pin configuration
const CAM_SDA_PIN    = 0;
const CAM_SCL_PIN    = 1;
const CAM_XCLK_PIN   = 5;
const CAM_PCLK_PIN   = 4;
const CAM_VSYNC_PIN  = 2;
const CAM_HREF_PIN   = 3;
const CAM_RESET_PIN  = -1;
const CAM_DATA0_PIN  = 12;
const CAM_FORMAT     = 'jpeg' as const;
const CAM_PIC_SIZE   = '640x480' as const;

async function executeCameraCommand(deviceId: string, event: any): Promise<any> {
  const ws = new WebsocketService();
  try {
    await ws.connect();
    const resp = await ws.executeCommand(deviceId, JSON.stringify(event));
    return JSON.parse(resp);
  } finally {
    ws.close();
  }
}

async function captureFrame(deviceId: string): Promise<string | null> {
  // Step 1: setup DVP and trigger capture
  const setupOpers: any[] = [];
  dvpSetHardwareOperation(
    setupOpers,
    CAM_SDA_PIN, CAM_SCL_PIN, CAM_XCLK_PIN, CAM_PCLK_PIN,
    CAM_VSYNC_PIN, CAM_HREF_PIN, CAM_RESET_PIN, CAM_DATA0_PIN,
    CAM_FORMAT, CAM_PIC_SIZE,
  );
  dvpCaptureHardwareOperation(setupOpers);
  const captureResponse = await executeCameraCommand(deviceId, constructNowEvent(setupOpers));

  if (captureResponse?.errorcode !== 0) {
    throw new Error('无法监测到照相机，请确保照相机模块连接正常');
  }

  // Step 2: read chunks until server signals no more data
  const base64Chunks: string[] = [];
  let moreData = true;
  while (moreData) {
    const readOpers: any[] = [];
    dvpReadHardwareOperation(readOpers);
    const readResponse = await executeCameraCommand(deviceId, constructNowEvent(readOpers));
    if (readResponse?.errorcode !== 0) {
      moreData = false;
    } else {
      base64Chunks.push(readResponse['result'][0][0]);
    }
  }

  if (base64Chunks.length === 0) return null;

  // Combine all base64 chunks into a single image URI
  const combined = Buffer.concat(base64Chunks.map(chunk => Buffer.from(chunk, 'base64')));
  return `data:image/jpeg;base64,${combined.toString('base64')}`;
}

const RemoteCameraScreen = ({ navigation, route }) => {
  const deviceId = route?.params?.id;
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [shotTime, setShotTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTakePhoto = async () => {
    setLoading(true);
    try {
      const uri = await captureFrame(deviceId);
      if (uri) {
        setImageUri(uri);
        setShotTime(new Date().toLocaleString('zh-CN', { hour12: false }));
      }
    } catch (err: any) {
      toast.fail('失败', err?.message ?? '拍照失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const opers: any[] = [];
      dvpResetHardwareOperation(opers);
      const response = await executeCameraCommand(deviceId, constructNowEvent(opers));
      if (response?.errorcode !== 0) {
        toast.fail('失败', '照相机重置失败，请重试');
      } else {
        toast.success('照相机重置成功');
      }
    } catch (err: any) {
      toast.fail('失败', err?.message ?? '重置失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <MainHeader
        title="远程照相机"
        back
        mainContainerStyle={{ paddingVertical: 0 }}
      />

      <View style={styles.content}>
        <View style={styles.imageArea}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
              resizeMode="contain"
            />
          ) : (
            <Text size={14} color="#9CA3AF">
              图片
            </Text>
          )}
        </View>
        {shotTime && (
          <Text size={12} color="#9CA3AF" style={{ marginTop: 8, textAlign: 'center' }}>
            {shotTime}
          </Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        {loading ? (
          <ActivityIndicator size="large" color="#354F8E" />
        ) : (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <PrimaryButton
              title="拍照"
              customStyles={[styles.takePhotoBtn, { flex: 1 }]}
              onPress={handleTakePhoto}
            />
            <PrimaryButton
              title="重置"
              customStyles={[styles.takePhotoBtn, { flex: 1, backgroundColor: '#6B7280' }]}
              onPress={handleReset}
            />
          </View>
        )}
      </View>
    </MainContainer>
  );
};

export default RemoteCameraScreen;