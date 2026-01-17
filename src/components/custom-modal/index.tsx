// CustomModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { styles } from "./styles";

type CustomModalProps = {
  isVisible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
};

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  onClose = () => null,
  children,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      // onBackButtonPress={onClose}
      backdropOpacity={0.3}
      style={styles.modal}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
