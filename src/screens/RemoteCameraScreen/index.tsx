import {
    MainContainer,
    MainHeader,
    PrimaryButton,
    SectionContainer,
    Text,
} from "@/src/components";
import { useTheme } from "@/src/hooks";
import { useState } from "react";
import { View, Alert } from "react-native";
import { SD } from "../../utils";
import { styles } from "./styles";

const RemoteCameraScreen = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);

  const handleConnectCamera = () => {
    setIsCameraReady(!isCameraReady);
    // TODO: Send command to platform to connect/disconnect camera
    console.log(`Camera ${isCameraReady ? 'Disconnected' : 'Connected'}`);
  };

  const handleTakePhoto = () => {
    if (!isCameraReady) {
      Alert.alert("错误", "请先连接相机");
      return;
    }
    setPhotoCount(photoCount + 1);
    // TODO: Send command to platform to take photo
    console.log(`Taking photo ${photoCount + 1}`);
    Alert.alert("成功", `照片 ${photoCount + 1} 已拍摄`);
  };

  const handleStartStopRecording = () => {
    if (!isCameraReady) {
      Alert.alert("错误", "请先连接相机");
      return;
    }
    setIsRecording(!isRecording);
    // TODO: Send command to platform to start/stop recording
    console.log(`${isRecording ? 'Stopping' : 'Starting'} recording`);
  };

  const handlePreviewImage = () => {
    if (!isCameraReady) {
      Alert.alert("错误", "请先连接相机");
      return;
    }
    // TODO: Open camera preview
    console.log("Opening camera preview");
    Alert.alert("预览", "打开相机预览界面");
  };

  return (
    <MainContainer>
      <MainHeader
        title="远程照相机"
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
            远程相机控制
          </Text>
          
          <View style={styles.statusContainer}>
            <Text bold size={16} color={AppTheme.Black} bottomSpacing={10}>
              相机状态: 
            </Text>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: isCameraReady ? AppTheme.lightGreen : AppTheme.fontGray }
            ]}>
              <Text bold size={14} color={AppTheme.White}>
                {isCameraReady ? '已连接' : '未连接'}
              </Text>
            </View>
          </View>

          <View style={styles.recordingContainer}>
            <Text bold size={16} color={AppTheme.Black} bottomSpacing={10}>
              录制状态: 
            </Text>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: isRecording ? AppTheme.Red : AppTheme.fontGray }
            ]}>
              <Text bold size={14} color={AppTheme.White}>
                {isRecording ? '录制中' : '未录制'}
              </Text>
            </View>
          </View>

          <View style={styles.photoCountContainer}>
            <Text bold size={16} color={AppTheme.Black}>
              已拍摄照片数量: {photoCount}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={isCameraReady ? '断开相机' : '连接相机'}
              customStyles={[
                styles.controlBtn,
                { backgroundColor: isCameraReady ? AppTheme.Red : AppTheme.Primary }
              ]}
              onPress={handleConnectCamera}
            />

            <PrimaryButton
              title="拍照"
              customStyles={[
                styles.controlBtn,
                { 
                  backgroundColor: isCameraReady ? AppTheme.lightGreen : AppTheme.fontGray,
                  opacity: isCameraReady ? 1 : 0.6
                }
              ]}
              onPress={handleTakePhoto}
            />

            <PrimaryButton
              title={isRecording ? '停止录制' : '开始录制'}
              customStyles={[
                styles.controlBtn,
                { 
                  backgroundColor: isRecording ? AppTheme.Red : AppTheme.Yellow,
                  opacity: isCameraReady ? 1 : 0.6
                }
              ]}
              onPress={handleStartStopRecording}
            />

            <PrimaryButton
              title="预览画面"
              customStyles={[
                styles.controlBtn,
                { 
                  backgroundColor: AppTheme.Primary,
                  opacity: isCameraReady ? 1 : 0.6
                }
              ]}
              onPress={handlePreviewImage}
            />
          </View>
        </View>
      </SectionContainer>
    </MainContainer>
  );
};

export default RemoteCameraScreen;