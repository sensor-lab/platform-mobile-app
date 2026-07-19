import { View } from "react-native";
import {
  CustomImage,
  MainContainer,
  PrimaryButton,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { PlatformSetupStepsCard } from "./components";
import { styles } from "./styles";

const ProvisionFinishScreen = ({ navigation, route }) => {
  const { AppTheme } = useTheme();
  const isSuccess = route?.params?.isSuccess || false;

  const handleNext = () => {
    navigation.replace(ScreenNames.MainScreen, {
      setup: isSuccess ? "completed" : null,
    });
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
            isActive={isSuccess}
            icon={Images.provisionFinishInternetConnect}
            text="连接成功"
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
    </MainContainer>
  );
};

const VerticalLine = () => <View style={styles.verticalLine} />;
export default ProvisionFinishScreen;
