import React, { useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { MainContainer, MainHeader } from "../../components";
import { SD } from "../../utils";

const HttpServerWebView = ({ route }) => {
  const ip = route?.params?.ip;
  const [loading, setLoading] = useState(true);

  return (
    <MainContainer
      customeStyle={{
        padding: 0,
        paddingVertical: 0,
        paddingHorizontal: 0,
        paddingTop: Platform.OS !== "ios" && SD.hp(50),
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
        source={{ uri: `http://${ip}/` }}
        style={{ flex: 1 }}
        renderLoading={() => <Text>Loading....</Text>}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        scrollEnabled={true}
        javaScriptEnabled={true}
        nestedScrollEnabled
        domStorageEnabled={true}
      />
    </MainContainer>
  );
};

export default HttpServerWebView;
