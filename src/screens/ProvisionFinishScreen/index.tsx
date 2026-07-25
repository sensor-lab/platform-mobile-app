import { useState } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import {
  ConnectionStatusModal,
  CustomImage,
  Loader,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { ConnectStatus, setPlatformDetailsById } from "../../redux/reducers";
import { WebsocketService } from "../../services/payload_service";
import { ProvisionService } from "../../services/provision_service";
import { toast } from "../../utils/toast.utils";
import { PlatformSetupStepsCard } from "./components";
import { styles } from "./styles";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ProvisionFinishScreen = ({ navigation, route }: any) => {
  const { AppTheme } = useTheme();
  const dispatch = useDispatch();
  const isSuccess = route?.params?.isSuccess || false;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  let devId = route?.params?.devId || ProvisionService.getDevId();

  const handleCancel = () => {
    setError("");
    navigation.navigate(ScreenNames.MainScreen);
  };

  const handleRetry = () => {
    setError("");
    void handleNext();
  };

  const handleNext = async () => {
    setError("");
    setLoading("正在连接云服务器...");

    if (!devId) {
      setLoading("");
      toast.fail("失败", "未获取到设备编号，请重试");
      return;
    }

    let i = 0;
    let connectedAndSynced = false;
    let lastError: unknown = null;
    const ws = WebsocketService.getInstance();
    try {
      await ws.connect();
    } catch (e) {
      console.log(`error connect: ${e}`);
      lastError = e;
    }

    while (i < 10) {
      i++;
      await wait(2000);
      try {
        const status = await ws.queryStatus(devId);
        const config = await ws.queryConfig(devId);
        const statusConfig = {
          ...status,
          ...config,
        };

        toast.success(`成功添加平台${devId}`);

        dispatch(
          setPlatformDetailsById({
            id: devId,
            details: {
              id: devId,
              mdnsName: statusConfig.mdns,
              fwVersion: statusConfig.fwver,
              hardwareVersion: statusConfig.hwver,
              voltage: statusConfig.voltage,
              platformStatus: statusConfig.status,
              tmzoneoffset: statusConfig.tmzoneoffset,
              rssi: statusConfig.rssi,
              connectStatus: ConnectStatus.Online,
            },
          }),
        );

        navigation.replace(ScreenNames.MainScreen, {
          setup: "completed",
        });

        connectedAndSynced = true;
        setLoading("");

        break;
      } catch (e) {
        console.log(`error: ${e}`);
      }
    }

    if (!connectedAndSynced) {
      setLoading("");
      setError("无法和云服务器连接");
    }

  };
  return (
    <MainContainer mainContainerStyle={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      <View style={styles.section}>
        <Text bold size={24} centered color={AppTheme.Black}>
          配置完成！
        </Text>
        <Text
          regular
          size={14}
          centered
          color={AppTheme.fontGray}
          topSpacing={8}
          bottomSpacing={8}
          leftSpacing={15}
          rightSpacing={15}
        >
          您的平台已成功连接到路由器
        </Text>
        <CustomImage
          source={isSuccess ? Images.platform : Images.platform}
          style={styles.printerImage}
        />
        <View style={styles.stepsSection}>
          <PlatformSetupStepsCard
            isActive={true}
            icon={Images.provisionFinishConfiguration}
            text="进入配置模式"
          />
          <VerticalLine />
          <PlatformSetupStepsCard
            isActive={isSuccess}
            icon={Images.wifi}
            text="连接到WiFi路由器"
          />
          <VerticalLine />
          <PlatformSetupStepsCard
            isActive={false}
            icon={Images.provisionFinishInternetConnect}
            text="测试和平台云连接"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="完成"
          customStyles={styles.nextBtn}
          textColor="#FFFFFF"
          onPress={handleNext}
        />
      </View>
      <ConnectionStatusModal
        isVisible={!!error}
        onClose={handleCancel}
        icon={Images.failWifi}
        title={"连接云服务器失败"}
        description={error}
        onRetry={handleRetry}
      />
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

const VerticalLine = () => <View style={styles.verticalLine} />;
export default ProvisionFinishScreen;
