import { WebsocketService } from "@/src/services/payload_service";
import { SD, toggleOnboardLED } from "@/src/utils";
import { toast } from "@/src/utils/toast.utils";
import { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import {
  CustomDropdown,
  CustomTextInput,
  InfoFieldComp,
  Loader,
  MainContainer,
  MainHeader,
  PrimaryButton,
} from "../../components";
import { useTheme } from "../../hooks";
import { styles } from "./styles";

const TestAppScreen = ({ route }) => {
  const id = route?.params?.id;
  const { AppTheme } = useTheme();
  const { height } = Dimensions.get("window");
  const [typeData, setTypeData] = useState([
    {
      label: "硬件执行操作",
      value: "0",
    },
    {
      label: "获取硬件操作",
      value: "1",
    },
    {
      label: "删除硬件操作",
      value: "2",
    },
    {
      label: "系统状态",
      value: "3",
    },
    {
      label: "重启系统",
      value: "4",
    },
  ]);
  const [selectedAPI, setSelectedAPI] = useState<string | number>("0");
  const [hardwareOperation, setHardwareOperation] =
    useState<string>(toggleOnboardLED);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleExecution = async () => {
    const dev = "9888e0926afc";
    const payload = '{"event":"now","actions":[["gpio", "led", "output", 2]]}';
    const url = "wss://iot.sensorsparks.com:8080/testapi";
    const ws = new WebsocketService(url);
    setLoading("硬件操作发送中");
    try {
      await ws.connect();
      const resp = await ws.executeCommand(dev, payload);
      setResponse(resp);
      toast.success("发送成功");
    } catch (err) {
      toast.fail("失败", "发送硬件操作失败");
    }
    setLoading(null);
    ws.close();
  };
  const handlePredefined = () => {
    setHardwareOperation(toggleOnboardLED);
  };

  return (
    <MainContainer
      mainContainerStyle={{
        paddingTop: 0,
      }}
    >
      <MainHeader
        mainContainerStyle={{ paddingTop: 0 }}
        back
        title="测试应用"
      />

      <MainContainer
        customeStyle={{
          marginTop: SD.hp(20),
          paddingHorizontal: 0,
          paddingVertical: 0,
          padding: 0,
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            // contentContainerStyle={{ flex: 1 }}
          >
            <View
              style={{
                height: height / 1.7,
                marginTop: SD.hp(20),
                marginBottom: SD.hp(20),
              }}
            >
              <InfoFieldComp
                title="测试API"
                children={
                  <CustomDropdown
                    iconColor={AppTheme.Primary}
                    data={typeData}
                    onChange={setSelectedAPI}
                    value={selectedAPI}
                    dropdownStyle={styles.dropdownStyles}
                    itemStyle={{
                      ...styles.customItemStyle,
                      backgroundColor: AppTheme.White,
                    }}
                    containerStyle={{
                      ...styles.itemContainerStyle,
                      backgroundColor: AppTheme.White,
                    }}
                  />
                }
              />

              <InfoFieldComp
                title="发送内容"
                height={200}
                children={
                  <CustomTextInput
                    value={hardwareOperation}
                    setValue={(e) => setHardwareOperation(e)}
                    backgroundColor={AppTheme.White}
                    placeholderTextColor={AppTheme.fontGray}
                    bold
                    fontSize={12}
                    textColor={AppTheme.fontGray}
                    topSpacing={10}
                    radius={10}
                    height={150}
                    multiline={true}
                    containerStyles={{ alignItems: "flex-start" }}
                    // disable={selectedIpAssignment == "2"}
                    style={{ padding: SD.wp(15) }}
                  />
                }
              />

              <InfoFieldComp
                title="返回结果"
                children={
                  <CustomTextInput
                    value={response}
                    setValue={(e) => setResponse(e)}
                    backgroundColor={AppTheme.White}
                    placeholderTextColor={AppTheme.fontGray}
                    bold
                    fontSize={12}
                    textColor={AppTheme.fontGray}
                    topSpacing={10}
                    radius={10}
                    height={50}
                    disable={true}
                    style={{ padding: SD.wp(15) }}
                  />
                }
              />
            </View>
            <PrimaryButton
              title="加载预定义操作"
              customStyles={{
                borderRadius: 15,
                backgroundColor: AppTheme.LightGray,
              }}
              onPress={handlePredefined}
            />
            <PrimaryButton
              title="执行操作"
              customStyles={{ borderRadius: 15 }}
              onPress={handleExecution}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </MainContainer>
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

export default TestAppScreen;
