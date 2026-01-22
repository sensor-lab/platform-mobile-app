import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ScreenNames } from "./src/config";
import { persistor, store } from "./src/redux";
import { MainScreen, PlatformSetupScreen } from "./src/screens";

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
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
              </Stack.Navigator>
            </NavigationContainer>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
