import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../design/tokens';

interface BrandmarkProps {
  size?: number;
  showWordmark?: boolean;
  tagline?: string;
}

const logoSource = require('../../assets/pet-lobby-logo.png');

/**
 * The Pet Lobby brandmark: paw-marker logo, optional wordmark and tagline.
 * Centred horizontally; the parent decides vertical placement.
 */
export function Brandmark({
  size = 88,
  showWordmark = true,
  tagline,
}: BrandmarkProps) {
  return (
    <View style={styles.wrapper}>
      <Image
        accessibilityIgnoresInvertColors
        accessibilityLabel="The Pet Lobby"
        resizeMode="contain"
        source={logoSource}
        style={[
          styles.logo,
          { height: size, width: size, borderRadius: radius.md },
        ]}
      />
      {showWordmark ? <Text style={styles.wordmark}>The Pet Lobby</Text> : null}
      {tagline ? <Text style={styles.tagline}>{tagline}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing[2],
  },
  // Keeps the border radius clipping consistent on iOS and Web.
  logo: {
    overflow: 'hidden',
  },
  wordmark: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  tagline: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 20,
    textAlign: 'center',
  },
});
