import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ScreenNames } from "./src/config";
import { persistor, store } from "./src/redux";
import {
  EnvironmentMonitorScreen,
  HttpServerWebView,
  LedStripController,
  MainScreen,
  PlatformInfoScreen,
  PlatformSettingScreen,
  PlatformSetupScreen,
  PowerControllerScreen,
  ProvisionConnectWifiScreen,
  ProvisionFinishScreen,
  ProvisionModeSelectScreen,
  ProvisionSetWifiPasswordScreen,
  ProvisionStartScreen,
  RemoteCameraScreen,
  TestAppScreen,
} from "./src/screens";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <>
              <StatusBar style="dark" />
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name={ScreenNames.MainScreen}
                    component={MainScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.PlatformSetupScreen}
                    component={PlatformSetupScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.ProvisionStartScreen}
                    component={ProvisionStartScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.ProvisionModeSelectScreen}
                    component={ProvisionModeSelectScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.ProvisionConnectWifiScreen}
                    component={ProvisionConnectWifiScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.ProvisionSetWifiPasswordScreen}
                    component={ProvisionSetWifiPasswordScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.ProvisionFinishScreen}
                    component={ProvisionFinishScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.PlatformSettingScreen}
                    component={PlatformSettingScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.PlatformInfoScreen}
                    component={PlatformInfoScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.TestAppScreen}
                    component={TestAppScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.HttpServerWebView}
                    component={HttpServerWebView}
                  />
                  <Stack.Screen
                    name={ScreenNames.LedStripController}
                    component={LedStripController}
                  />
                  <Stack.Screen
                    name={ScreenNames.EnvironmentMonitorScreen}
                    component={EnvironmentMonitorScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.PowerControllerScreen}
                    component={PowerControllerScreen}
                  />
                  <Stack.Screen
                    name={ScreenNames.RemoteCameraScreen}
                    component={RemoteCameraScreen}
                  />
                </Stack.Navigator>
              </NavigationContainer>
              <Toast />
            </>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
