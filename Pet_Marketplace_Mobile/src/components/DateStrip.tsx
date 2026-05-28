import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "../design/tokens";

export interface DateOption {
  id: string;
  weekday: string;
  day: string;
}

interface DateStripProps {
  dates: DateOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function DateStrip({ dates, selectedId, onSelect }: DateStripProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.row}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {dates.map((date) => {
        const selected = date.id === selectedId;
        return (
          <Pressable
            accessibilityLabel={`${date.weekday} ${date.day}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={date.id}
            onPress={() => onSelect(date.id)}
            style={({ pressed }) => [
              styles.cell,
              selected ? styles.cellSelected : null,
              pressed ? styles.pressed : null,
            ]}
          >
            <Text
              style={[styles.weekday, selected ? styles.textSelected : null]}
            >
              {date.weekday}
            </Text>
            <Text style={[styles.day, selected ? styles.textSelected : null]}>
              {date.day}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Builds the next `count` days starting today, for the demo date picker. */
export function buildUpcomingDates(count: number): DateOption[] {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const out: DateOption[] = [];
  const base = new Date();
  for (let index = 0; index < count; index += 1) {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    out.push({
      id: date.toISOString().slice(0, 10),
      weekday: weekdays[date.getDay()] ?? "",
      day: String(date.getDate()).padStart(2, "0"),
    });
  }
  return out;
}

const styles = StyleSheet.create({
  row: {
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  cell: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing[1],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    width: 60,
  },
  cellSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pressed: {
    opacity: 0.75,
  },
  weekday: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  day: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
  },
  textSelected: {
    color: colors.onAccent,
  },
});
