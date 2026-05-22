import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../design/tokens';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

// Status is always communicated by text, never by colour alone (design.md §9).
const tones: Record<BadgeTone, { background: string; text: string }> = {
  neutral: { background: colors.surfaceMuted, text: colors.muted },
  success: { background: '#E3F6EC', text: colors.successText },
  warning: { background: colors.warningSurface, text: colors.text },
  danger: { background: colors.dangerSurface, text: colors.danger },
  info: { background: colors.accentSoft, text: colors.accentPressed },
};

export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const palette = tones[tone];

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  label: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
});
