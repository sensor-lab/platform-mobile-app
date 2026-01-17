// components/Loader.tsx
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { BlurView } from "@react-native-community/blur";

interface LoaderProps {
  visible: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ visible, text = "Loading..." }) => {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <BlurView style={styles.blur} blurType="light" blurAmount={10} />
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
