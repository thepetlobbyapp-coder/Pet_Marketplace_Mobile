import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getProviders } from "../../src/api/client";
import { hasTutorProfile, useMeQuery } from "../../src/api/useMeQuery";
import { useAuth } from "../../src/auth/AuthProvider";
import { CategoryChip } from "../../src/components/CategoryChip";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { HeroBanner } from "../../src/components/HeroBanner";
import { IconButton } from "../../src/components/IconButton";
import { LoadingState } from "../../src/components/LoadingState";
import { TutorProfileRequiredState } from "../../src/components/ProfileRequiredState";
import { ProviderCard } from "../../src/components/ProviderCard";
import { Screen } from "../../src/components/Screen";
import { SearchInput } from "../../src/components/SearchInput";
import { SectionHeader } from "../../src/components/SectionHeader";
import { demoCategories } from "../../src/data/demoFixtures";
import { colors, spacing, typography } from "../../src/design/tokens";
import { t } from "../../src/i18n";

const HOME_PROVIDERS_LIMIT = 3;
const HOME_PROVIDERS_OFFSET = 0;

// DEMO SEED: categories still come from local fixtures. Provider preview and
// tutor greeting use live marketplace data and must not fall back to demo users.
export default function HomeScreen() {
  const { accessToken, session } = useAuth();
  const userId = session?.user.id;
  const meQuery = useMeQuery();
  const canUseMarketplace = hasTutorProfile(meQuery.data);
  const providersQuery = useQuery({
    enabled: Boolean(accessToken && canUseMarketplace),
    queryKey: [
      "providers",
      "home-preview",
      userId,
      HOME_PROVIDERS_LIMIT,
      HOME_PROVIDERS_OFFSET,
    ],
    queryFn: () =>
      getProviders(accessToken, {
        limit: HOME_PROVIDERS_LIMIT,
        offset: HOME_PROVIDERS_OFFSET,
      }),
    retry: 1,
  });
  const providers = providersQuery.data ?? [];

  function openSearch() {
    router.push(canUseMarketplace ? "/search" : "/profile");
  }

  function openProvider(providerId: string) {
    router.push(`/provider/${providerId}`);
  }

  function openNotifications() {
    // Routes to the in-app notifications stub (B1 wave). The screen is
    // documented as a "coming soon" placeholder until push delivery and
    // persisted history ship; the bell still feels clickable and the
    // marketing flow has a real target.
    router.push("/notifications");
  }

  const safeTutorDisplayName = getSafeTutorDisplayName(
    meQuery.data?.profiles?.tutor?.displayName,
  );
  const greeting = safeTutorDisplayName
    ? `${t("home.greeting")}, ${safeTutorDisplayName}`
    : t("home.greeting");

  return (
    <Screen variant="top">
      <View style={styles.topRow}>
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.contextLine}>{t("home.next.title")}</Text>
        </View>
        <IconButton
          accessibilityLabel={t("home.notifications.label")}
          icon="notifications-outline"
          onPress={openNotifications}
          showDot
        />
      </View>

      <SearchInput onPress={openSearch} />

      <ScrollView
        contentContainerStyle={styles.categories}
        horizontal
        // Same fix as search.tsx — without `flexGrow:0` the horizontal
        // ScrollView absorbs the column's remaining height and the chip
        // children stretch vertically (alignItems: stretch by default).
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
      >
        {demoCategories.map((category) => (
          <CategoryChip
            icon={category.icon}
            key={category.id}
            label={category.label}
            onPress={openSearch}
          />
        ))}
      </ScrollView>

      <HeroBanner
        body={t("home.hero.body")}
        ctaLabel={t("home.hero.cta")}
        onCtaPress={openSearch}
        title={t("home.hero.title")}
      />

      <SectionHeader
        actionLabel={t("home.providers.action")}
        onActionPress={openSearch}
        title={t("home.providers.title")}
      />

      <View style={styles.providerList}>
        {!accessToken ? (
          <EmptyState
            message={t("home.providers.noSessionBody")}
            title={t("home.providers.noSessionTitle")}
          />
        ) : meQuery.isLoading ? (
          <LoadingState label={t("profile.loading")} />
        ) : meQuery.isError ? (
          <ErrorState
            actionLabel={t("common.retry")}
            message={t("profile.error")}
            onRetry={() => meQuery.refetch()}
            title={t("common.error")}
          />
        ) : !canUseMarketplace ? (
          <TutorProfileRequiredState
            message={t("home.providers.profileRequiredBody")}
          />
        ) : providersQuery.isLoading ? (
          <LoadingState label={t("home.providers.loading")} />
        ) : providersQuery.isError ? (
          <ErrorState
            actionLabel={t("common.retry")}
            message={t("home.providers.errorBody")}
            onRetry={() => providersQuery.refetch()}
            title={t("home.providers.errorTitle")}
          />
        ) : providers.length === 0 ? (
          <EmptyState
            actionLabel={t("home.providers.emptyAction")}
            message={t("home.providers.emptyBody")}
            onAction={openSearch}
            title={t("home.providers.emptyTitle")}
          />
        ) : (
          providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              onPress={() => openProvider(provider.id)}
              provider={provider}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

function getSafeTutorDisplayName(displayName?: string | null) {
  const value = displayName?.trim().replace(/\s+/g, " ");
  if (!value) {
    return "";
  }

  const containsEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
  const containsUuid =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i.test(value);
  const looksLikeToken =
    /\b(?:bearer|authorization|token|password)\b/i.test(value) ||
    /\b[A-Za-z0-9_-]{32,}\b/.test(value);

  if (containsEmail || containsUuid || looksLikeToken) {
    return "";
  }

  return value.slice(0, 40);
}

const styles = StyleSheet.create({
  topRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  greetingBlock: {
    flex: 1,
    gap: spacing[1],
  },
  greeting: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
  },
  contextLine: {
    color: colors.muted,
    fontSize: typography.body,
    fontWeight: "700",
  },
  categoriesScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  categories: {
    alignItems: "center",
    gap: spacing[3],
    paddingVertical: spacing[1],
  },
  providerList: {
    gap: spacing[3],
  },
});
