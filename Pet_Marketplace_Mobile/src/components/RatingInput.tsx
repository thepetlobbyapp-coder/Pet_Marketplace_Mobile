import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { colors, spacing } from "../design/tokens";

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  size?: number;
}

/** Interactive 1-5 star selector for rating a completed service. */
export function RatingInput({
  value,
  onChange,
  disabled = false,
  size = 36,
}: RatingInputProps) {
  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={`Rating ${value} out of 5`}
      accessibilityValue={{ min: 1, max: 5, now: value }}
      style={styles.row}
    >
      {[1, 2, 3, 4, 5].map((position) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${position} ${position === 1 ? "star" : "stars"}`}
          accessibilityState={{ disabled, selected: value >= position }}
          disabled={disabled}
          hitSlop={6}
          key={position}
          onPress={() => onChange(position)}
          style={({ pressed }) => [
            styles.star,
            pressed && !disabled ? styles.pressed : null,
          ]}
        >
          <Ionicons
            color={value >= position ? colors.star : colors.border}
            name={value >= position ? "star" : "star-outline"}
            size={size}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[1],
  },
  star: {
    padding: spacing[1],
  },
  pressed: {
    opacity: 0.6,
  },
});
