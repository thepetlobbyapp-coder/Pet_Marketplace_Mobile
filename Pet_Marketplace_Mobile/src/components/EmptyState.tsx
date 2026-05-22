import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../design/tokens';
import { Button } from './Button';

interface EmptyStateProps {
  actionLabel?: string;
  message: string;
  onAction?: () => void;
  title: string;
}

export function EmptyState({
  actionLabel,
  message,
  onAction,
  title,
}: EmptyStateProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[5],
  },
  title: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
});
