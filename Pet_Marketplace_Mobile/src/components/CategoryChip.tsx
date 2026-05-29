import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../design/tokens";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface CategoryChipProps {
  label: string;
  icon: IconName;
  selected?: boolean;
  onPress?: () => void;
}

export function CategoryChip({
  label,
  icon,
  selected = false,
  onPress,
}: CategoryChipProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.wrapper, pressed ? styles.pressed : null]}
    >
      <View style={[styles.iconBox, selected ? styles.iconBoxSelected : null]}>
        <Ionicons
          color={selected ? colors.onAccent : colors.accentPressed}
          name={icon}
          size={24}
        />
      </View>
      <Text numberOfLines={1} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: spacing[2],
    width: 68,
  },
  pressed: {
    opacity: 0.7,
  },
  iconBox: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  iconBoxSelected: {
    backgroundColor: colors.accent,
  },
  label: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "600",
    textAlign: "center",
  },
});
