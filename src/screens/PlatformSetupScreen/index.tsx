import { ScreenNames } from "@/src/config";
import { ConnectStatus, setPlatformDetailsById } from "@/src/redux/reducers";
import { WebsocketService } from "@/src/services/payload_service";
import { toast } from "@/src/utils/toast.utils";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
    CustomTextInput,
    InfoFieldComp,
    Loader,
    MainContainer,
    MainHeader,
    PrimaryButton,
} from "../../components";
import { useTheme } from "../../hooks";
import { SD } from "../../utils";

const PlatformSetupScreen = ({ navigation, route }) => {
  const [platformID, setPlatformID] = useState("");
  const { AppTheme } = useTheme();
  const [loading, setLoading] = useState<string | null>(null);
  const dispatch = useDispatch();
  const { platformDetailsByID } = useSelector((state: any) => state.platform);

  useEffect(() => {
    // mixpanel.track("Printer Nested Setting Page");
  }, []);

  const handleTestConnection = async () => {
    console.log(`Test connection for ${platformID}`);
    const payload = '{"event":"now","actions":[["gpio", "led", "output", 2]]}';
    const ws = new WebsocketService();
    setLoading("连接测试中");
    try {
      await ws.connect();
      await ws.executeCommand(platformID, payload);
      toast.success("成功翻转绿色创意盒LED灯");
    } catch (err) {
      toast.fail("失败", "测试连接失败");
    }
    setLoading(null);
    ws.close();
  };

  const handleAddDevice = async () => {
    const ws = new WebsocketService();
    setLoading("连接并添加平台中");
    try {
      await ws.connect();
      const status = await ws.queryStatus(platformID);
      const config = await ws.queryConfig(platformID);
      const statusConfig = {
        ...status,
        ...config,
      };
      toast.success(`成功添加平台${platformID}`);

      dispatch(
        setPlatformDetailsById({
          id: platformID,
          details: {
            id: platformID,
            mdnsName: statusConfig.mdns,
            fwVersion: statusConfig.fwver,
            hardwareVersion: statusConfig.hwver,
            voltage: statusConfig.voltage,
            platformStatus: statusConfig.status,
            connectStatus: ConnectStatus.Online,
          },
        }),
      );

      navigation.replace(ScreenNames.MainScreen, {
        setup: "completed",
      });
    } catch (err) {
      toast.fail("失败,请重试");
    } finally {
      setLoading(null);
      ws.close();
    }
  };

  // const handleSetValues = async () => {
  //   if (statusCategory !== "OK") {
  //     return toast.fail("Failed", "Printer is not ready!");
  //   }
  //   try {
  //     setLoading(`Updating settings...`);
  //     let response = await sendRequest({
  //       ip: IP_Address,
  //       endpoint: "saveprintervarvalues.cgi",
  //       method: "POST",
  //       data: `Darkness=${sliderValue}&SpeedV=${selectedSpeed}`,
  //     });
  //     refetch();
  //     setLoading(null);
  //     toast.success("Success setting updated!");
  //   } catch (err) {
  //     setLoading(null);
  //     toast.fail("Failed", "Update failed.");
  //   }
  // };
  // const handleTestValues = async () => {
  //   // let response await sendRequest()

  //   try {
  //     setLoading("Sending test command...");

  //     let script = generateTestLabelScript(LanguageV, {
  //       speedValue: selectedSpeed,
  //       darkness: sliderValue,
  //     });

  //     let response = await sendRequest({
  //       ip: IP_Address,
  //       endpoint: "scripttransfer.cgi",
  //       method: "POST",
  //       data: script,
  //       headers: { "Content-Type": "text/plain" },
  //     });
  //     setLoading(null);
  //     toast.success("Test print command sent!");
  //   } catch (error) {
  //     setLoading(null);

  //     toast.fail("Failed", "Test failed.");
  //   }
  // };
  return (
    <MainContainer>
      <MainHeader
        mainContainerStyle={{ paddingVertical: 0 }}
        back
        title="添加创意盒"
      />
      <View style={{ marginTop: SD.hp(10), flex: 1 }}>
        <InfoFieldComp
          title="创意盒编号"
          children={
            <CustomTextInput
              placeholder="输入编号"
              value={platformID}
              setValue={(e) => setPlatformID(e)}
              backgroundColor={AppTheme.White}
              placeholderTextColor={AppTheme.fontGray}
              bold
              fontSize={12}
              textColor={AppTheme.fontGray}
              topSpacing={10}
              radius={10}
              height={50}
            />
          }
        />
      </View>
      <PrimaryButton
        title="添加"
        customStyles={{ marginVertical: 0 }}
        onPress={handleAddDevice}
      />
      <PrimaryButton title="测试连接" onPress={handleTestConnection} />
      <Loader visible={!!loading} text={loading} />
    </MainContainer>
  );
};

export default PlatformSetupScreen;
