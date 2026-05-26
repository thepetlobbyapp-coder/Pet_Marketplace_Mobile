import { useMutation, useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ApiClientError, getProvider, openConversation } from '../../src/api/client';
import type { ConversationResponse, ProviderResponse } from '../../src/api/types';
import { useAuth } from '../../src/auth/AuthProvider';
import { Avatar } from '../../src/components/Avatar';
import { Button } from '../../src/components/Button';
import { EmptyState } from '../../src/components/EmptyState';
import { ErrorState } from '../../src/components/ErrorState';
import { InfoRow } from '../../src/components/InfoRow';
import { LoadingState } from '../../src/components/LoadingState';
import { RatingStars } from '../../src/components/RatingStars';
import { Screen } from '../../src/components/Screen';
import { SectionHeader } from '../../src/components/SectionHeader';
import { demoProviders } from '../../src/data/demoFixtures';
import { colors, radius, shadow, spacing, typography } from '../../src/design/tokens';
import { t } from '../../src/i18n';
import { formatDistance, formatPriceBRL, formatPriceGBP } from '../../src/lib/format';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// DEMO SEED: provider detail still supports local demo IDs used by Home.
// Real UUID provider IDs use the backend and never fall back to fixtures.
export default function ProviderDetailScreen() {
  const { accessToken, session } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const providerId = typeof id === 'string' ? id : '';

  if (UUID_PATTERN.test(providerId)) {
    return (
      <RealProviderDetail
        accessToken={accessToken}
        providerId={providerId}
        userId={session?.user.id}
      />
    );
  }

  const provider = demoProviders.find((item) => item.id === providerId);

  if (!provider) {
    return (
      <Screen>
        <EmptyState
          actionLabel={t('provider.detail.backToSearch')}
          message={t('provider.detail.notFound.body')}
          onAction={() => router.push('/search')}
          title={t('provider.detail.notFound.title')}
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
            {provider.isAvailable
              ? t('provider.detail.status.available')
              : t('provider.detail.status.unavailable')}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow
          icon="location-outline"
          label={t('provider.detail.distance')}
          value={`${formatDistance(provider.distanceMeters)} ${t(
            'provider.detail.distanceFromArea',
          )}`}
        />
        <InfoRow
          icon="cash-outline"
          label={t('provider.detail.estimatedPrice')}
          value={`${formatPriceBRL(provider.pricePerHour)} / ${t(
            'book.summary.perHour',
          )}`}
        />
        <InfoRow
          icon="star-outline"
          label={t('provider.detail.reviews')}
          value={`${provider.rating.toFixed(1)} (${provider.reviewCount} reviews)`}
        />
      </View>

      <SectionHeader title={t('provider.detail.section')} />
      <Text style={styles.bio}>{provider.bio}</Text>

      <Button
        disabled={!provider.isAvailable}
        label={
          provider.isAvailable
            ? t('provider.detail.book')
            : t('provider.detail.status.noSlots')
        }
        onPress={() => router.push(`/book?providerId=${provider.id}`)}
      />
    </Screen>
  );
}

function RealProviderDetail({
  accessToken,
  providerId,
  userId,
}: {
  accessToken: string | null;
  providerId: string;
  userId?: string;
}) {
  const providerQuery = useQuery({
    enabled: Boolean(accessToken),
    queryKey: ['provider', userId, providerId],
    queryFn: () => getProvider(accessToken, providerId),
    retry: 1,
  });

  if (!accessToken) {
    return (
      <Screen>
        <EmptyState
          actionLabel={t('provider.detail.backToSearch')}
          message={t('provider.detail.authenticated.body')}
          onAction={() => router.push('/search')}
          title={t('provider.detail.authenticated.title')}
        />
      </Screen>
    );
  }

  if (providerQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label={t('provider.detail.loading')} />
      </Screen>
    );
  }

  if (providerQuery.isError || !providerQuery.data) {
    return (
      <Screen>
        <ErrorState
          actionLabel={t('common.retry')}
          message={t('provider.detail.error.body')}
          onRetry={() => providerQuery.refetch()}
          title={t('provider.detail.notFound.title')}
        />
      </Screen>
    );
  }

  return (
    <RealProviderContent
      accessToken={accessToken}
      provider={providerQuery.data}
    />
  );
}

function RealProviderContent({
  accessToken,
  provider,
}: {
  accessToken: string | null;
  provider: ProviderResponse;
}) {
  const [chatError, setChatError] = useState<string | null>(null);

  const openChatMutation = useMutation({
    mutationFn: () => openConversation(accessToken, { providerId: provider.id }),
    onMutate: () => {
      setChatError(null);
    },
    onError: (error) => {
      setChatError(getOpenChatErrorMessage(error));
    },
    onSuccess: (conversation: ConversationResponse) => {
      router.push(`/chat?conversationId=${conversation.id}`);
    },
  });

  return (
    <Screen variant="top">
      <View style={styles.hero}>
        <Avatar name={provider.name} size={88} uri={provider.avatarUrl ?? undefined} />
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
            {provider.isAvailable
              ? t('provider.detail.status.available')
              : t('provider.detail.status.unavailable')}
          </Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <InfoRow
          icon="location-outline"
          label={t('provider.detail.distance')}
          value={formatDistance(provider.distanceMeters)}
        />
        <InfoRow
          icon="cash-outline"
          label={t('provider.detail.estimatedPrice')}
          value={`${formatPriceGBP(provider.pricePerHour)} / ${t(
            'book.summary.perHour',
          )}`}
        />
        <InfoRow
          icon="star-outline"
          label={t('provider.detail.reviews')}
          value={`${provider.rating.toFixed(1)} (${provider.reviewCount} reviews)`}
        />
      </View>

      <SectionHeader title={t('provider.detail.section')} />
      <Text style={styles.bio}>
        {provider.bio ?? t('provider.detail.noBio')}
      </Text>

      <View style={styles.actions}>
        <Button
          label={t('provider.detail.book')}
          onPress={() => router.push(`/book?providerId=${provider.id}`)}
        />
        <Button
          isLoading={openChatMutation.isPending}
          label={
            openChatMutation.isPending
              ? t('provider.detail.chat.opening')
              : t('provider.detail.chat')
          }
          onPress={() => openChatMutation.mutate()}
          variant="secondary"
        />
        {chatError ? (
          <Text accessibilityRole="alert" style={styles.chatError}>
            {chatError}
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}

/** Mapeia o erro do client em microcopy estável (i18n en-GB). */
function getOpenChatErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (error.status === 403) return t('provider.detail.chat.error.blocked');
    if (error.status === 404)
      return t('provider.detail.chat.error.unavailable');
    if (error.status === 429)
      return t('provider.detail.chat.error.rateLimited');
  }
  return t('provider.detail.chat.error.generic');
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
    backgroundColor: colors.successSurface,
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
  actions: {
    gap: spacing[3],
  },
  chatError: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '700',
    lineHeight: 20,
  },
});
