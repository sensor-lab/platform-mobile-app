import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./src/redux";
import { DetailsScreen } from "./src/screens/DetailsScreen";
import { HomeScreen } from "./src/screens/HomeScreen";

type RootStackParamList = {
  Home: undefined;
  Details: { id: number; name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: true,
                headerTintColor: "#007AFF",
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Home" }}
              />
              <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={{ title: "Details" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
