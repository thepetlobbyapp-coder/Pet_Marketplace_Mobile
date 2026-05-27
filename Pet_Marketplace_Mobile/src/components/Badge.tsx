import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../design/tokens';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  /** Optional Ionicon rendered to the left of the label. Inherits the tone
   *  text colour so badges keep a single visual focus. */
  icon?: IconName;
}

// Status is always communicated by text, never by colour alone (design.md §9).
const tones: Record<BadgeTone, { background: string; text: string }> = {
  neutral: { background: colors.surfaceMuted, text: colors.muted },
  success: { background: '#E3F6EC', text: colors.successText },
  warning: { background: colors.warningSurface, text: colors.text },
  danger: { background: colors.dangerSurface, text: colors.danger },
  info: { background: colors.accentSoft, text: colors.accentPressed },
};

export function Badge({ label, tone = 'neutral', icon }: BadgeProps) {
  const palette = tones[tone];

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      {icon ? (
        <Ionicons color={palette.text} name={icon} size={12} />
      ) : null}
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    flexDirection: 'row',
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  label: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
