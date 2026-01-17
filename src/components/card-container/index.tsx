import React, { useEffect, useRef } from "react";
import { Animated, Pressable, View, ViewStyle } from "react-native";
import { useTheme } from "../../hooks";
import { SD } from "../../utils";
import { styles } from "./CardContainerStyles";
import { CardContainerProps } from "./CardContainerTypes";

// Create an animated version of Pressable
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  borderColor,
  customStyles,
  onPress,
  cardContainerRef,
  backgroundColor,
  showSimpleView = false,
  showShadow = true,
  disabled = false,
}) => {
  const { AppTheme } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handlePressIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.8, // Active opacity value
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    opacity: fadeAnim,
    borderColor: borderColor || AppTheme.Primary,
    backgroundColor: backgroundColor || AppTheme.Base,
  };

  return showSimpleView ? (
    <View
      style={[
        styles.container(AppTheme),
        showShadow && { ...SD.createShadow },
        customStyles,
      ]}
    >
      {children}
    </View>
  ) : (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      ref={cardContainerRef}
      style={[
        styles.container(AppTheme),
        showShadow && { ...SD.createShadow },
        animatedStyle,
        customStyles,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
};
