import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../design/tokens';
import { Button } from './Button';

interface ErrorStateProps {
  actionLabel: string;
  message: string;
  onRetry: () => void;
  title: string;
}

export function ErrorState({
  actionLabel,
  message,
  onRetry,
  title,
}: ErrorStateProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Button label={actionLabel} onPress={onRetry} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[3],
    paddingTop: spacing[2],
  },
  title: {
    color: colors.danger,
    fontSize: typography.body,
    fontWeight: '700',
  },
  message: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
  },
});
