import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
} from 'react-native';
import { colors, spacing, typography } from '../design/tokens';

interface ButtonProps extends Pick<PressableProps, 'disabled' | 'onPress'> {
  isLoading?: boolean;
  label: string;
  variant?: 'primary' | 'secondary';
}

export function Button({
  disabled,
  isLoading = false,
  label,
  onPress,
  variant = 'primary',
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.surface : colors.accent}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  primary: {
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.accentSoft,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.48,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '700',
  },
  primaryLabel: {
    color: colors.surface,
  },
  secondaryLabel: {
    color: colors.accentPressed,
  },
});
