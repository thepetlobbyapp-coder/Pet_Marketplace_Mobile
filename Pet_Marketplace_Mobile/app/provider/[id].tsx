import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { InfoRow } from '../../src/components/InfoRow';
import { RatingStars } from '../../src/components/RatingStars';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { demoProviders } from '../../src/data/demoFixtures';
import { colors, radius, shadow, spacing, typography } from '../../src/design/tokens';
import { formatDistance, formatPriceBRL } from '../../src/lib/format';

// DEMO SEED: provider detail comes from local fixtures until the marketplace
// backend ships. See src/data/demoFixtures.ts.
export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const provider = demoProviders.find((item) => item.id === id);

  if (!provider) {
    return (
      <Screen>
        <EmptyState
          actionLabel="Voltar para a busca"
          message="Este prestador não está mais disponível."
          onAction={() => router.push('/search')}
          title="Prestador não encontrado"
        />
      </Screen>
    );
  }

  return (
    <Screen variant="top">
      <View style={styles.hero}>
        <Avatar name={provider.name} size={88} uri={provider.avatarUri} />
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.service}>{provider.service}</Text>
        <RatingStars
          rating={provider.rating}
          reviewCount={provider.reviewCount}
          size={16}
        />
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
            {provider.isAvailable ? 'Disponível agora' : 'Sem horários no momento'}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow
          icon="location-outline"
          label="Distância"
          value={`${formatDistance(provider.distanceMeters)} do seu condomínio`}
        />
        <InfoRow
          icon="cash-outline"
          label="Valor estimado"
          value={`${formatPriceBRL(provider.pricePerHour)} / hora`}
        />
        <InfoRow
          icon="star-outline"
          label="Avaliações"
          value={`${provider.rating.toFixed(1)} (${provider.reviewCount} avaliações)`}
        />
      </View>

      <SectionHeader title="Sobre o prestador" />
      <Text style={styles.bio}>{provider.bio}</Text>

      <Button
        disabled={!provider.isAvailable}
        label={
          provider.isAvailable ? 'Agendar serviço' : 'Sem horários disponíveis'
        }
        onPress={() => router.push(`/book?providerId=${provider.id}`)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  name: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
    textAlign: 'center',
  },
  service: {
    color: colors.muted,
    fontSize: typography.body,
  },
  status: {
    borderRadius: radius.pill,
    marginTop: spacing[2],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  statusOn: {
    backgroundColor: '#E3F6EC',
  },
  statusOff: {
    backgroundColor: colors.surfaceMuted,
  },
  statusText: {
    fontSize: typography.small,
    fontWeight: '700',
  },
  statusTextOn: {
    color: colors.successText,
  },
  statusTextOff: {
    color: colors.muted,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing[4],
    padding: spacing[4],
    ...shadow.sm,
  },
  bio: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
  },
});
