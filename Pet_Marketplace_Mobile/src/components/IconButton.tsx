import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, radius } from "../design/tokens";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface IconButtonProps {
  // Accessible label is required: an icon-only control needs a text name.
  accessibilityLabel: string;
  icon: IconName;
  onPress?: () => void;
  // 'soft' = light purple chip; 'plain' = transparent; 'accent' = filled.
  variant?: "soft" | "plain" | "accent";
  size?: number;
  // Optional small dot to flag unread/pending state.
  showDot?: boolean;
}

export function IconButton({
  accessibilityLabel,
  icon,
  onPress,
  variant = "soft",
  size = 22,
  showDot = false,
}: IconButtonProps) {
  const iconColor = variant === "accent" ? colors.onAccent : colors.text;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "soft" ? styles.soft : null,
        variant === "accent" ? styles.accent : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Ionicons color={iconColor} name={icon} size={size} />
      {showDot ? <View style={styles.dot} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  soft: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  accent: {
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.7,
  },
  dot: {
    backgroundColor: colors.danger,
    borderColor: colors.surface,
    borderRadius: 999,
    borderWidth: 2,
    height: 12,
    position: "absolute",
    right: 8,
    top: 8,
    width: 12,
  },
});
