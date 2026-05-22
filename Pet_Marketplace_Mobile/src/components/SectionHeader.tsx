import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, typography } from '../design/tokens';

interface SectionHeaderProps {
  title: string;
  // Optional trailing action (e.g. "Ver todos").
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
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
  title: {
    color: colors.text,
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
