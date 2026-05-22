import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../design/tokens';

interface TimeChipProps {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}

export function TimeChip({
  label,
  selected = false,
  disabled = false,
  onPress,
}: TimeChipProps) {
  return (
    <Pressable
      accessibilityLabel={`Horário ${label}`}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : null,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : null,
          disabled ? styles.labelDisabled : null,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    minWidth: 76,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  selected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  disabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '700',
  },
  labelSelected: {
    color: colors.onAccent,
  },
  labelDisabled: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
});
