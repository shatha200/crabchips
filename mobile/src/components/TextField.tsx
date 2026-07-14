import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../contexts/ThemeContext";
import { radius, spacing, typography, fonts } from "../lib/theme";

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}

// Shared input used across the whole app (auth, checkout, profile, dish
// forms, etc.) so every text field gets the same modern look: floating
// focus ring, consistent radius/spacing, and — on web — a fix for the
// browser's autofill highlight overriding our styling (see index.web
// injected CSS in app/_layout.tsx).
export function TextField({ label, error, icon, style, ...props }: TextFieldProps) {
  const theme = useAppTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? theme.error : focused ? theme.primary : theme.border;

  return (
    <View style={{ marginBottom: spacing.sm }}>
      {label ? (
        <Text style={[typography.caption, { color: theme.textSecondary, marginBottom: 6, fontFamily: fonts.bodySemiBold }]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: theme.surface,
            borderColor,
            borderWidth: focused ? 2 : 1,
          },
        ]}
      >
        {icon ? <Ionicons name={icon} size={18} color={theme.textSecondary} style={{ marginRight: spacing.xs }} /> : null}
        <TextInput
          placeholderTextColor={theme.textSecondary}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          style={[styles.input, { color: theme.textPrimary, fontFamily: fonts.body }, style]}
          {...props}
        />
      </View>
      {error ? <Text style={[typography.caption, { color: theme.error, marginTop: 4 }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 15,
  },
});
