import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import WebSocketWithSelfSignedCert from "react-native-websocket-self-signed";
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

  const [connected1, setConnected1] = useState<boolean>(false);
  const [connected2, setConnected2] = useState<boolean>(false);
  const [messages1, setMessages1] = useState<string[]>([]);
  const [messages2, setMessages2] = useState<string[]>([]);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const [payload, setPayload] = useState<string>("Hello, World!");

  const connectToWebSocket = useCallback(
    (
      ws: WebSocketWithSelfSignedCert,
      setConnected: React.Dispatch<React.SetStateAction<boolean>>,
      setMessages: React.Dispatch<React.SetStateAction<string[]>>,
      setError: React.Dispatch<React.SetStateAction<string | null>>,
      target: string,
    ) => {
      setError(null);

      ws.onOpen(() => {
        console.log(`WebSocket connection opened: ${target}`);
        setConnected(true);
      });

      ws.onMessage((message: string) => {
        console.log(`Received message from ${target}:`, message);
        setMessages((prev) => [...prev, message]);
      });

      ws.onClose(() => {
        console.log(`WebSocket connection closed: ${target}`);
        setConnected(false);
      });

      ws.onError((err: string) => {
        console.error(`Failed to connect to ${target}:`, err);
        setError(`Failed to connect: ${err}`);
      });

      ws.connect({
        "X-Ssl-Client-Cert":
          "MIIDMzCCAhsCFDXGga4JSMEujL5rMZabeeHFpTmPMA0GCSqGSIb3DQEBCwUAMFQx" +
          "CzAJBgNVBAYTAlVTMQ4wDAYDVQQIDAVTdGF0ZTENMAsGA1UEBwwEQ2l0eTEVMBMG" +
          "A1UECgwMT3JnYW5pemF0aW9uMQ8wDQYDVQQDDAZUZXN0Q0EwHhcNMjYwMTA3MDQw" +
          "NjI5WhcNMzYwMTA1MDQwNjI5WjBYMQswCQYDVQQGEwJVUzEOMAwGA1UECAwFU3Rh" +
          "dGUxDTALBgNVBAcMBENpdHkxFTATBgNVBAoMDE9yZ2FuaXphdGlvbjETMBEGA1UE" +
          "AwwKVGVzdENsaWVudDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJkf" +
          "wytr6bkpC+W+SGzdIIUbHN4CpexMYzP5emyzGDv9p9dsM6gqxjMs3zrmswUjWiI1" +
          "5otL8TEIQQH0ABbxBfCtzv4Gs6DQnBc8JPd3rbSNFNQ5WcofW5M868L2VBQP/raR" +
          "DM/EW6rOQBMwnvV+gNIq9Uaryyz4w7gmcVeOs2+bPN+8GPYVsEQKhFcRoE5Fv7pc" +
          "Yxj7JG+LE/mAlvGwlnGIy60azp8n09gm21awhjjtphMW6o2jN14lw93YnuT/yXcO" +
          "2U4qc3VKnK9QGF/Xus2lb7DLBTtJAuwVRXMiItoGi31skMIH6FnHrnsB0bvJLGr1" +
          "wKTSdccYNi10kruJVbUCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAemVdnFrllvtr" +
          "kkQReKPg58IFGxcix2HdSJQi+3rhD8p2ijikdLON6iKhW8GtuN575xkPNG0EhMNy" +
          "v1KWwNrvzND5inGNDuUUxBZ9CG7baPEmfHgFwBuH+VmoxMXv44bil1epaiYX3GIP" +
          "0wOzjyTBXo7XKqneVQgxjAr8BwLcNxSHVFAKupkK1i4PoMjba61RGxPoaisjoBEi" +
          "CVCLKQ04+iDTkB7m9dV+Boy3uQG0+C4Hj1qJHf6c0zSBsgmTN1zgQhIyhsplbeU2" +
          "xhsCnBrVLsU1oL+rbXbpg1Dg8OMGrlh4X8loDeJ0mZiX7M0k9egUTRFvjEyC7EDy" +
          "6dTMiDfpjA==",
      })
        .then(() => {
          console.log(`Connected to ${target}`);
          setConnected(true);
        })
        .catch((err) => {
          console.error(`Failed to connect to ${target}: `, err);
          setError(`Failed to connect: ${err}`);
        });

      return () => {
        ws.close();
      };
    },
    [],
  );

  const targetWebSocket1 = "wss://iot.sensorsparks.com:8080/testapi";
  const ws1: WebSocketWithSelfSignedCert = useMemo(
    () => WebSocketWithSelfSignedCert.getInstance(targetWebSocket1),
    [targetWebSocket1],
  );

  useEffect(() => {
    // mixpanel.track("Printer Nested Setting Page");
  }, []);

  const handleTestConnection = async () => {
    console.log(`Test connection for ${platformID}`);
    const cleanup1 = connectToWebSocket(
      ws1,
      setConnected1,
      setMessages1,
      setError1,
      targetWebSocket1,
    );
    // const wsService = new WebSocketService(
    //   "wss://iot.sensorsparks.com:8080/testapi",
    // );
    // try {
    //   console.log("Attempting to connect...");
    //   await wsService.connect();
    //   console.log("Connected successfully!");
    //   wsService.onConnectionChange((connected: boolean) =>
    //     console.log(`onConnectionChange callback: ${connected}`),
    //   );
    // } catch (error) {
    //   console.error("Connection failed:", error);
    // }
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
