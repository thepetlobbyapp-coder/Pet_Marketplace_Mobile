import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../design/tokens";

interface AvatarProps {
  name: string;
  size?: number;
  uri?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

// memory-disk caching gives us a transparent LRU cache for signed avatar URLs;
// when the signed URL rotates after expiry the key changes naturally.
const AVATAR_CACHE_POLICY = "memory-disk" as const;

export function Avatar({ name, size = 48, uri }: AvatarProps) {
  const shape = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return (
      <Image
        accessibilityLabel={name}
        cachePolicy={AVATAR_CACHE_POLICY}
        contentFit="cover"
        source={{ uri }}
        style={[styles.image, shape]}
        transition={120}
      />
    );
  }

  return (
    <View
      accessibilityLabel={name}
      accessibilityRole="image"
      style={[styles.fallback, shape]}
    >
      <Text style={[styles.initials, { fontSize: size / 2.6 }]}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceMuted,
  },
  fallback: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    justifyContent: "center",
  },
  initials: {
    color: colors.accentPressed,
    fontWeight: "800",
  },
});
