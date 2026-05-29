import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../design/tokens";

interface ScreenHeaderProps {
  kicker?: string;
  subtitle?: string;
  title: string;
}

export function ScreenHeader({ kicker, subtitle, title }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {kicker ? <Text style={styles.kicker}>{kicker}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  kicker: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
  },
});
