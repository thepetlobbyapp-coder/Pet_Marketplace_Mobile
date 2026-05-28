import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, spacing, typography } from "../design/tokens";

interface CondoSelectorProps {
  condominium: string;
  onPress?: () => void;
}

export function CondoSelector({ condominium, onPress }: CondoSelectorProps) {
  return (
    <Pressable
      accessibilityHint="Change area"
      accessibilityLabel={`Area: ${condominium}`}
      accessibilityRole="button"
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <Ionicons color={colors.accent} name="location" size={15} />
      <Text numberOfLines={1} style={styles.text}>
        {condominium}
      </Text>
      <Ionicons color={colors.muted} name="chevron-down" size={15} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1],
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: colors.muted,
    flexShrink: 1,
    fontSize: typography.small,
    fontWeight: "600",
  },
});
