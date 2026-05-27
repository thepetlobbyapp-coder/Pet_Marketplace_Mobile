import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../design/tokens';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface SectionHeaderProps {
  title: string;
  // Optional leading icon (Ionicons) rendered to the left of the title.
  icon?: IconName;
  // Optional trailing action (e.g. "Ver todos").
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({
  title,
  icon,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.titleGroup}>
        {icon ? (
          <Ionicons color={colors.accent} name={icon} size={20} />
        ) : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={onActionPress}
          style={({ pressed }) => (pressed ? styles.pressed : null)}
        >
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    flexShrink: 1,
    gap: spacing[2],
  },
  title: {
    color: colors.text,
    flexShrink: 1,
    fontSize: typography.section,
    fontWeight: '800',
  },
  action: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.6,
  },
});
