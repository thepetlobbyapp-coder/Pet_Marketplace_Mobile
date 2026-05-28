import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadow, spacing, typography } from "../design/tokens";

interface HeroBannerProps {
  title: string;
  body: string;
  ctaLabel: string;
  onCtaPress?: () => void;
  imageUri?: string;
}

export function HeroBanner({
  title,
  body,
  ctaLabel,
  onCtaPress,
  imageUri,
}: HeroBannerProps) {
  return (
    <View style={styles.banner}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onCtaPress}
          style={({ pressed }) => [styles.cta, pressed ? styles.pressed : null]}
        >
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
          <Ionicons color={colors.accent} name="arrow-forward" size={16} />
        </Pressable>
      </View>
      {imageUri ? (
        <Image
          accessibilityIgnoresInvertColors
          source={{ uri: imageUri }}
          style={styles.image}
        />
      ) : (
        <View style={styles.imageFallback}>
          <Ionicons color={colors.onAccent} name="paw" size={44} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: radius.xl,
    flexDirection: "row",
    gap: spacing[3],
    overflow: "hidden",
    padding: spacing[5],
    ...shadow.md,
  },
  text: {
    flex: 1,
    gap: spacing[2],
  },
  title: {
    color: colors.onAccent,
    fontSize: typography.section,
    fontWeight: "800",
    lineHeight: 26,
  },
  body: {
    color: colors.accentSoft,
    fontSize: typography.small,
    lineHeight: 20,
  },
  cta: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.onAccent,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing[1],
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  pressed: {
    opacity: 0.85,
  },
  ctaLabel: {
    color: colors.accent,
    fontSize: typography.small,
    fontWeight: "800",
  },
  image: {
    backgroundColor: colors.accentDark,
    borderRadius: radius.lg,
    height: 104,
    width: 96,
  },
  imageFallback: {
    alignItems: "center",
    backgroundColor: colors.accentDark,
    borderRadius: radius.lg,
    height: 104,
    justifyContent: "center",
    width: 96,
  },
});
