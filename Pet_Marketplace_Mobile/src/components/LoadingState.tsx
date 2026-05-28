import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../design/tokens";

interface LoadingStateProps {
  label: string;
}

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <View accessibilityRole="progressbar" style={styles.wrapper}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    gap: spacing[3],
    paddingVertical: spacing[4],
  },
  label: {
    color: colors.muted,
    fontSize: typography.body,
  },
});
