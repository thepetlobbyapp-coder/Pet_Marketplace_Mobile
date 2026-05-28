import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../design/tokens";

type IconName = ComponentProps<typeof Ionicons>["name"];

interface InfoRowProps {
  icon: IconName;
  label: string;
  value: string;
}

export function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Ionicons color={colors.accentPressed} name={icon} size={18} />
      </View>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
  },
  iconBox: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  label: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
});
