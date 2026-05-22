import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadow, spacing } from '../design/tokens';

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[3],
    padding: spacing[5],
    ...shadow.sm,
  },
});
