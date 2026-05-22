import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../design/tokens';
import type { DemoProvider } from '../data/demoFixtures';
import { formatDistance } from '../lib/format';
import { Avatar } from './Avatar';
import { RatingStars } from './RatingStars';

interface ProviderCardProps {
  provider: DemoProvider;
  onPress?: () => void;
}

export function ProviderCard({ provider, onPress }: ProviderCardProps) {
  return (
    <Pressable
      accessibilityHint="Abre os detalhes do prestador"
      accessibilityLabel={`${provider.name}, ${provider.service}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <Avatar name={provider.name} size={56} uri={provider.avatarUri} />
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.name}>
          {provider.name}
        </Text>
        <Text numberOfLines={1} style={styles.service}>
          {provider.service}
        </Text>
        <View style={styles.metaRow}>
          <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} />
          <View style={styles.distance}>
            <Ionicons color={colors.muted} name="location-outline" size={13} />
            <Text style={styles.distanceText}>
              {formatDistance(provider.distanceMeters)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.trailing}>
        <View
          style={[
            styles.status,
            provider.isAvailable ? styles.statusOn : styles.statusOff,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              provider.isAvailable ? styles.statusTextOn : styles.statusTextOff,
            ]}
          >
            {provider.isAvailable ? 'Disponível' : 'Ocupado'}
          </Text>
        </View>
        <Ionicons color={colors.muted} name="chevron-forward" size={18} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[4],
    ...shadow.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  service: {
    color: colors.muted,
    fontSize: typography.small,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginTop: spacing[1],
  },
  distance: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  distanceText: {
    color: colors.muted,
    fontSize: typography.caption,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: spacing[2],
  },
  status: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  statusOn: {
    backgroundColor: '#E3F6EC',
  },
  statusOff: {
    backgroundColor: colors.surfaceMuted,
  },
  statusText: {
    fontSize: typography.caption,
    fontWeight: '700',
  },
  statusTextOn: {
    color: colors.successText,
  },
  statusTextOff: {
    color: colors.muted,
  },
});
