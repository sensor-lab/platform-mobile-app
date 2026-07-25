import { WebsocketService } from "@/src/services/payload_service";
import { ProvisionService } from "@/src/services/provision_service";
import { toast } from "@/src/utils/toast.utils";
import { View } from "react-native";
import {
  CustomImage,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { usePermission } from "../../hooks/usePermission";
import { styles } from "./styles";

const ProvisionStartScreen = ({ navigation }: any) => {
  const { checkAndRequestPermission } = usePermission("wifi");
  const handleNext = async () => {
    const hasPermission = await checkAndRequestPermission();
    if (!hasPermission) {
      toast.fail("失败", "需要位置权限才能连接 Wi-Fi 设备");
      return;
    }

    console.log("ESP provisioining!")

    console.log("close existing websocket if any")
    const ws = WebsocketService.getInstance();
    await ws.close();

    await ProvisionService.connect();

    navigation.navigate(ScreenNames.ProvisionModeSelectScreen);
  };
  const handleSkip = () => {
    return navigation.replace(ScreenNames.MainScreen);
  };

  return (
    <MainContainer mainContainerStyle={{ backgroundColor: "#FFFFFF" }}>
      <Text medium size={14} style={styles.skipBtn} onPress={handleSkip}>
        跳过
      </Text>
      <View style={styles.section}>
        <Text bold size={36} centered style={styles.title}>
          进入配置模式
        </Text>
        <Text
          regular
          size={14}
          centered
          color="#666A73"
          style={styles.descriptionPrimary}
        >
          配置平台连接到路由器或将平台设置为移动热点
        </Text>
        <Text regular size={14} centered color="#666A73" style={styles.description}>
          按住平台左按钮并连接电源线，即可进入配置模式
        </Text>
        <Text regular size={14} centered color="#666A73" style={styles.description}>
          平台屏幕上显示配置模式字样
        </Text>
        <CustomImage
          source={Images.provisionStartPlatform}
          style={styles.printerImage}
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title="下一步"
          customStyles={styles.nextBtn}
          textColor="#FFFFFF"
          onPress={handleNext}
        />
      </View>
    </MainContainer>
  );
};

export default ProvisionStartScreen;
