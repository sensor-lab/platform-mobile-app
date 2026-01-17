import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  Home: undefined;
  Details: { id: number; name: string };
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home Screen</Text>
      <Text style={styles.subtitle}>
        This is the main screen of your application
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Details", { id: 1, name: "Sample Item" })
        }
      >
        <Text style={styles.buttonText}>Go to Details Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
