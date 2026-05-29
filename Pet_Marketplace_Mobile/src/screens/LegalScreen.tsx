import { StyleSheet, Text } from "react-native";
import { Screen } from "../components/Screen";
import { colors, spacing, typography } from "../design/tokens";

interface LegalScreenProps {
  body: string;
  title: string;
}

export function LegalScreen({ body, title }: LegalScreenProps) {
  return (
    <Screen>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
    marginBottom: spacing[4],
  },
  body: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
  },
});
