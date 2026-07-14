import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useAppTheme } from "../contexts/ThemeContext";
import { radius, spacing, typography, motion } from "../lib/theme";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  style,
}: ButtonProps) {
  const theme = useAppTheme();
  const scale = useSharedValue(1);

  const backgroundColor =
    variant === "primary"
      ? theme.primary
      : variant === "danger"
        ? theme.error
        : "transparent";
  const textColor = variant === "primary" || variant === "danger" ? theme.onPrimary : theme.primary;
  const borderColor = variant === "outline" ? theme.primary : "transparent";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => {
        if (!disabled && !loading) {
          scale.value = withTiming(0.96, { duration: motion.fast });
        }
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: motion.fast });
      }}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderWidth: variant === "outline" ? 1.5 : 0,
          opacity: disabled ? 0.5 : 1,
          // Modern glow shadow for call to action buttons
          shadowColor: variant === "primary" ? theme.primary : variant === "danger" ? theme.error : "transparent",
          shadowOpacity: (variant === "primary" || variant === "danger") ? 0.22 : 0,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: (variant === "primary" || variant === "danger") ? 3 : 0,
        },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[typography.bodyBold, { color: textColor, letterSpacing: 0.2 }]}>{label}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    width: "100%",
  },
});
