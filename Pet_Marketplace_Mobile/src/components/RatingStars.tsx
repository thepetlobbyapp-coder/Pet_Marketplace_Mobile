import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../design/tokens';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export function RatingStars({ rating, reviewCount, size = 14 }: RatingStarsProps) {
  const rounded = Math.round(rating * 2) / 2;
  const label =
    reviewCount === undefined
      ? `Rating ${rating.toFixed(1)} out of 5`
      : `Rating ${rating.toFixed(1)} out of 5, ${reviewCount} reviews`;

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="text"
      style={styles.row}
    >
      {[1, 2, 3, 4, 5].map((position) => {
        const name =
          rounded >= position
            ? 'star'
            : rounded >= position - 0.5
              ? 'star-half'
              : 'star-outline';
        return (
          <Ionicons color={colors.star} key={position} name={name} size={size} />
        );
      })}
      <Text style={styles.value}>{rating.toFixed(1)}</Text>
      {reviewCount !== undefined ? (
        <Text style={styles.count}>({reviewCount})</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  value: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: '700',
    marginLeft: spacing[1],
  },
  count: {
    color: colors.muted,
    fontSize: typography.caption,
  },
});
