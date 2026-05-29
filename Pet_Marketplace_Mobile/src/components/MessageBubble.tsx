import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../design/tokens";

interface MessageBubbleProps {
  text: string;
  time: string;
  // true = message received from the provider (left, light bubble).
  // false = message sent by the tutor (right, purple bubble).
  fromProvider: boolean;
  isReportPending?: boolean;
  onReport?: () => void;
}

export function MessageBubble({
  text,
  time,
  fromProvider,
  isReportPending = false,
  onReport,
}: MessageBubbleProps) {
  return (
    <View style={[styles.row, fromProvider ? styles.rowLeft : styles.rowRight]}>
      <View
        style={[
          styles.bubble,
          fromProvider ? styles.bubbleProvider : styles.bubbleTutor,
        ]}
      >
        <Text
          style={[
            styles.text,
            fromProvider ? styles.textProvider : styles.textTutor,
          ]}
        >
          {text}
        </Text>
        <Text
          style={[
            styles.time,
            fromProvider ? styles.timeProvider : styles.timeTutor,
          ]}
        >
          {time}
        </Text>
        {onReport ? (
          <Pressable
            accessibilityLabel="Report message"
            accessibilityRole="button"
            disabled={isReportPending}
            hitSlop={8}
            onPress={onReport}
            style={[
              styles.reportButton,
              fromProvider
                ? styles.reportButtonProvider
                : styles.reportButtonTutor,
              isReportPending ? styles.reportButtonDisabled : null,
            ]}
          >
            <Ionicons
              color={fromProvider ? colors.muted : colors.accentSoft}
              name={isReportPending ? "hourglass-outline" : "flag-outline"}
              size={15}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  rowLeft: {
    justifyContent: "flex-start",
  },
  rowRight: {
    justifyContent: "flex-end",
  },
  bubble: {
    borderRadius: radius.lg,
    gap: spacing[1],
    maxWidth: "82%",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  bubbleProvider: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: radius.sm,
    borderColor: colors.border,
    borderWidth: 1,
  },
  bubbleTutor: {
    backgroundColor: colors.accent,
    borderBottomRightRadius: radius.sm,
  },
  text: {
    fontSize: typography.body,
    lineHeight: 22,
  },
  textProvider: {
    color: colors.text,
  },
  textTutor: {
    color: colors.onAccent,
  },
  time: {
    fontSize: typography.caption,
  },
  timeProvider: {
    color: colors.muted,
    textAlign: "right",
  },
  timeTutor: {
    color: colors.accentSoft,
    textAlign: "right",
  },
  reportButton: {
    alignItems: "center",
    borderRadius: radius.sm,
    height: 28,
    justifyContent: "center",
    marginTop: spacing[1],
    width: 28,
  },
  reportButtonProvider: {
    alignSelf: "flex-end",
    backgroundColor: colors.surfaceMuted,
  },
  reportButtonTutor: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  reportButtonDisabled: {
    opacity: 0.5,
  },
});
