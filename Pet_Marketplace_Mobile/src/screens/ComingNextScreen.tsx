import { StyleSheet, Text } from 'react-native';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { colors, spacing, typography } from '../design/tokens';

interface ComingNextScreenProps {
  body: string;
  title: string;
}

export function ComingNextScreen({ body, title }: ComingNextScreenProps) {
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
    marginBottom: spacing[2],
  },
  body: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
  },
});
