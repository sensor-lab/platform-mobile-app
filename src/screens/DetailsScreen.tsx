import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  Home: undefined;
  Details: { id: number; name: string };
};

type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, "Details">;

export const DetailsScreen: React.FC<DetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { id, name } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{id}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
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
    marginBottom: 30,
    color: "#333",
  },
  infoBox: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
