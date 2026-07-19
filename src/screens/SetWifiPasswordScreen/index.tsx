import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import {
  ConnectionStatusModal,
  CustomImage,
  CustomTextInput,
  InfoFieldComp,
  Loader,
  MainContainer,
  MainHeader,
  PrimaryButton,
  SectionContainer,
  Text,
} from "../../components";
import { Images, ScreenNames } from "../../config";
import { useTheme } from "../../hooks";
import { ProvisionService } from "../../services/provision_service";
import { toast } from "../../utils/toast.utils";
import { styles } from "./styles";

type WifiNetwork = {
  auth: number;
  rssi: number;
  ssid: string;
};

const SetWifiPasswordScreen = ({ navigation, route }: any) => {
  const { AppTheme } = useTheme();
  const router = route?.params?.wifi as WifiNetwork | undefined;
  const [wifiPassword, setWifiPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState("")
  const [loading, setLoading] = useState("");

  const handleOnClose = () => {
    setError("");
  };

  const handleTriggerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleApply = async () => {
    try {
      setError("");
      setLoading("正在和路由器连接")
      if (!router?.ssid) {
        toast.fail("失败", "未找到路由器信息");
        return;
      }
      const resp = await ProvisionService.ssidConnect(router.ssid, wifiPassword);
      if (resp == "AUTH_FAILED") {
        setError("路由器密码错误，请重试")
      } else if (resp == "success") {
        navigation.navigate(ScreenNames.ProvisionFinishScreen, {
          isSuccess: true,
        });
      }
      console.log(`Jay debug: ${resp}`)
    } catch (error) {
      console.log("ERROR CONNECTING => ", error);
      toast.fail("失败", "连接路由器失败");
    } finally {
      setLoading("");
    }
  };

  return (
    <MainContainer mainContainerStyle={{ backgroundColor: "#FFFFFF" }}>
      <MainHeader
        back
        title="路由器信息"
        mainContainerStyle={{
          paddingVertical: 0,
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <View style={styles.container}>
              <SectionContainer
                bgColor="#F3F6FB"
                containerStyles={styles.networkIconView}
              >
                <CustomImage
                  source={Images.wifiRound}
                  style={styles.networkIcon}
                />
              </SectionContainer>
              <Text
                bold
                size={18}
                color={AppTheme.Black}
                centered
                topSpacing={24}
                bottomSpacing={28}
              >
                请输入路由器Wi-Fi密码
              </Text>
              <InfoFieldComp
                title="路由器名称"
                height={120}
                children={
                  <CustomTextInput
                    placeholder="路由器名称"
                    value={router?.ssid ?? ""}
                    setValue={() => undefined}
                    backgroundColor={AppTheme.White}
                    placeholderTextColor={AppTheme.fontGray}
                    bold
                    fontSize={12}
                    textColor={AppTheme.fontGray}
                    topSpacing={10}
                    radius={10}
                    height={50}
                    disable={true}
                  />
                }
              />
              <InfoFieldComp
                title="密码"
                height={120}
                children={
                  <CustomTextInput
                    placeholder="输入密码"
                    value={wifiPassword}
                    setValue={(e) => setWifiPassword(e)}
                    backgroundColor={AppTheme.White}
                    placeholderTextColor={AppTheme.fontGray}
                    bold
                    fontSize={12}
                    textColor={AppTheme.fontGray}
                    topSpacing={10}
                    radius={10}
                    height={50}
                    secureText={showPassword}
                    icon={showPassword ? Images.eye : Images.eyeClose}
                    onIconPress={handleTriggerShowPassword}
                  />
                }
              />
            </View>

            <PrimaryButton
              title="连接"
              customStyles={styles.submitButton}
              onPress={handleApply}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Loader visible={!!loading} text={loading} />
      <ConnectionStatusModal
        isVisible={!!error}
        onClose={handleOnClose}
        icon={Images.failWifi}
        title={"无法连接到路由器"}
        description={error}
        onRetry={handleOnClose}
      />
    </MainContainer>
  );
};

export default SetWifiPasswordScreen;
