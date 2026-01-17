import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, ViewStyle } from 'react-native';

type ToucableFeedbackProps = {
  children: React.ReactNode;
  customStyle?: ViewStyle;
};

export const ToucableFeedback: React.FC<ToucableFeedbackProps> = ({
  children,
  customStyle,
}) => {
  return (
    <TouchableWithoutFeedback
      style={[{flex: 1}, customStyle]}
      onPress={Keyboard.dismiss}>
      {children}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({});
