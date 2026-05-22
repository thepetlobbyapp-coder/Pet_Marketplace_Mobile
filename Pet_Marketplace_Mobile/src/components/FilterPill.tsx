import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../design/tokens';

interface FilterPillProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}

export function FilterPill({ label, selected = false, onPress }: FilterPillProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  selected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.onAccent,
  },
});
