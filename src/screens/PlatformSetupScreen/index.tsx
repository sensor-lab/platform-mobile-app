import { TopicType, WebsocketService } from "@/src/services/payload_service";
import { useEffect, useState } from "react";
import { View } from "react-native";
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

const PlatformSetupScreen = ({ route }) => {
  const [platformID, setPlatformID] = useState("");

  const { AppTheme } = useTheme();
  const [loading, setLoading] = useState(null);

  const targetWebSocket1 = "wss://iot.sensorsparks.com:8080/testapi";

  useEffect(() => {
    // mixpanel.track("Printer Nested Setting Page");
  }, []);

  const handleTestConnection = async () => {
    console.log(`Test connection for ${platformID}`);
    const dev = "9888e0926afc";
    const payload = '{"event":"now","actions":[["gpio", "led", "output", 2]]}';
    const ws = new WebsocketService(targetWebSocket1);
    const respTopic = `platform.ephemeral.${dev}-${ws.getTxid()}`;
    await ws.connect();
    const subResp = await ws.sendSubscribe(
      respTopic,
      respTopic,
      "",
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );
    console.log(`subResp: ${subResp.length}`);
    const cmdResp = await ws.sendCommand(dev, payload);
    console.log(`cmdResp: ${cmdResp.length}`);
    const waitResp = await ws.waitForResponse();
    console.log(`waitResp: ${waitResp.length}`);
    const unsubResp = await ws.sendUnsubscribe(
      respTopic,
      respTopic,
      "",
      "",
      TopicType.TOPIC_TYPE_EPHEMERAL_TOPIC,
    );
    console.log(`unsubResp: ${unsubResp.length}`);
    ws.close();
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
        // onPress={null}
      />
      <PrimaryButton title="测试连接" onPress={handleTestConnection} />
      <Loader visible={!!loading} text="loading!" />
    </MainContainer>
  );
};

export default PlatformSetupScreen;
