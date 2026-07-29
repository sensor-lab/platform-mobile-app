import React, { useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import {
  CustomModal,
  MainContainer,
  MainHeader,
  PrimaryButton,
} from "../../components";
import { SD } from "../../utils";

const HttpServerWebView = ({ route }: { route: any }) => {
  const targetUrl = `http://${route?.params?.ip.trim()}/`;
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseError = () => setErrorMessage("");

  return (
    <>
      <MainContainer
        customeStyle={{
          padding: 0,
          paddingVertical: 0,
          paddingHorizontal: 0,
          paddingTop: Platform.OS !== "ios" ? SD.hp(50) : 0,
        }}
      >
        <MainHeader
          title="HTTP Server"
          back
          mainContainerStyle={{
            paddingVertical: 0,
            //   flex: 1,
            paddingHorizontal: SD.wp(10),
            paddingBottom: 0,
            marginBottom: 0,
            marginVertical: 0,
            paddingTop: 0,
          }}
        />
        {loading && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size={"large"} color={"black"} />
          </View>
        )}
        <WebView
          source={{ uri: targetUrl }}
          style={{ flex: 1 }}
          renderLoading={() => <Text>Loading....</Text>}
          onLoadStart={() => {
            setLoading(true);
            setErrorMessage("");
          }}
          onLoadEnd={() => setLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setErrorMessage(
              `页面加载失败（${nativeEvent.description || "未知错误"}，URL: ${targetUrl}）。请确认手机已连接到设备热点并重试。`,
            );
          }}
          scrollEnabled={true}
          javaScriptEnabled={true}
          nestedScrollEnabled
          domStorageEnabled={true}
        />
      </MainContainer>

      <CustomModal isVisible={!!errorMessage} onClose={handleCloseError}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: SD.hp(2),
            paddingHorizontal: SD.wp(6),
            paddingVertical: SD.hp(3),
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#B3261E",
              fontSize: SD.hp(2.1),
              textAlign: "center",
              marginBottom: SD.hp(2),
            }}
          >
            {errorMessage}
          </Text>
          <PrimaryButton
            title="确定"
            onPress={handleCloseError}
            customStyles={{
              width: "100%",
              borderRadius: SD.hp(1.5),
              marginVertical: 0,
            }}
          />
        </View>
      </CustomModal>
    </>
  );
};

export default HttpServerWebView;
