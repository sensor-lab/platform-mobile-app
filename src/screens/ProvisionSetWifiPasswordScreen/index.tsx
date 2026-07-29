import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useDispatch } from "react-redux";
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
import type { ProvisionMode } from "../../utils/common.utils";
import { toast } from "../../utils/toast.utils";
import { styles } from "./styles";

type WifiNetwork = {
  auth: number;
  rssi: number;
  ssid: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ProvisionSetWifiPasswordScreen = ({ navigation, route }: any) => {
  const { AppTheme } = useTheme();
  const dispatch = useDispatch();
  const mode = (route?.params?.mode as ProvisionMode | undefined) ?? "station";
  const router = route?.params?.wifi as WifiNetwork | undefined;
  const [accessPointName, setAccessPointName] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState("")
  const [loading, setLoading] = useState("");

  const handleCancel = () => {
    setError("");
    navigation.navigate(ScreenNames.MainScreen)
  };

  const handleRetry = () => {
    setError("");
    navigation.navigate(ScreenNames.ProvisionStartScreen)
  }

  const handleTriggerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleApply = async () => {
    try {
      setError("");
      if (mode === "station") {
        setLoading("正在和路由器连接")
        if (!router?.ssid) {
          toast.fail("失败", "未找到路由器信息");
          return;
        }

        const resp = await ProvisionService.ssidConnect(router.ssid, wifiPassword);
        if (resp == "AUTH_FAILED") {
          setLoading("")
          setError("路由器密码错误，请重试")
        } else if (resp == "success") {

          const devId = ProvisionService.getDevId()

          if (!devId) {
            setError("未获取到设备编号，请重试");
            return;
          }

          setLoading("等待平台重启");

          await wait(15000);

          navigation.navigate(ScreenNames.ProvisionFinishScreen, {
            isSuccess: true,
            devId,
            mode,
            apSsid: "",
            apPassword: "",
          });
        }
      } else {
        // Setting to Access Point
        if (!accessPointName.trim()) {
          toast.fail("失败", "请输入热点名称");
          return;
        }

        if (wifiPassword.length > 0 && wifiPassword.length < 8) {
          toast.fail("失败", "热点密码至少需要8个字符");
          return;
        }

        setLoading("正在设置平台热点")
        const resp = await ProvisionService.setupAccessPoint(
          accessPointName.trim(),
          wifiPassword
        );

        if (resp === "error") {
          toast.fail("失败", "设置平台热点失败");
        } else {
          const devId = ProvisionService.getDevId();
          navigation.navigate(ScreenNames.ProvisionFinishScreen, {
            isSuccess: true,
            devId,
            mode,
            apSsid: accessPointName.trim(),
            apPassword: wifiPassword,
          });
        }
      }

    } catch (error) {
      console.log("ERROR CONNECTING => ", error);
      toast.fail("失败", mode === "station" ? "连接路由器失败" : "设置平台热点失败");
    } finally {
      setLoading("");
    }
  };

  return (
    <MainContainer mainContainerStyle={{ backgroundColor: "#FFFFFF" }}>
      <MainHeader
        back
        title={mode === "station" ? "路由器信息" : "平台热点信息"}
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
                {mode === "station" ? "请输入路由器Wi-Fi密码" : "请设置平台热点名称和密码"}
              </Text>
              <InfoFieldComp
                title={mode === "station" ? "路由器名称" : "平台热点名称"}
                height={120}
                children={
                  <CustomTextInput
                    placeholder={mode === "station" ? "路由器名称" : "输入平台热点名称"}
                    value={mode === "station" ? (router?.ssid ?? "") : accessPointName}
                    setValue={mode === "station" ? () => undefined : setAccessPointName}
                    backgroundColor={AppTheme.White}
                    placeholderTextColor={AppTheme.fontGray}
                    bold
                    fontSize={12}
                    textColor={AppTheme.fontGray}
                    topSpacing={10}
                    radius={10}
                    height={50}
                    disable={mode === "station"}
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
              title={mode === "station" ? "连接" : "创建热点"}
              customStyles={styles.submitButton}
              onPress={handleApply}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Loader visible={!!loading} text={loading} />
      <ConnectionStatusModal
        isVisible={!!error}
        onClose={handleCancel}
        icon={Images.failWifi}
        title={"无法连接到路由器"}
        description={error}
        onRetry={handleRetry}
      />
    </MainContainer>
  );
};

export default ProvisionSetWifiPasswordScreen;
