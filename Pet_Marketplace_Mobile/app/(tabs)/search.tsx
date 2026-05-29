import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import type { ComponentProps } from "react";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getProviders } from "../../src/api/client";
import type { ProviderCategory } from "../../src/api/types";
import {
  hasTutorDefaultAddress,
  hasTutorProfile,
  useMeQuery,
} from "../../src/api/useMeQuery";
import { useAuth } from "../../src/auth/AuthProvider";
import { CategoryChip } from "../../src/components/CategoryChip";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { LoadingState } from "../../src/components/LoadingState";
import {
  TutorAddressRequiredState,
  TutorProfileRequiredState,
} from "../../src/components/ProfileRequiredState";
import { ProviderCard } from "../../src/components/ProviderCard";
import { Screen } from "../../src/components/Screen";
import { SearchInput } from "../../src/components/SearchInput";
import { colors, spacing, typography } from "../../src/design/tokens";
import { t } from "../../src/i18n";

const PROVIDERS_LIMIT = 20;
const PROVIDERS_OFFSET = 0;
const PROVIDERS_SEARCH_MAX_LENGTH = 80;
const SEARCH_DEBOUNCE_MS = 350;

type SearchCategory = "all" | ProviderCategory;
type IoniconName = ComponentProps<typeof Ionicons>["name"];

// Icon mapping mirrors `docs/design.md` §9 category chips (walk, sitting,
// transport, boarding) plus an `all` reset chip. Keep in sync with backend
// `ProviderCategory` enum.
const CATEGORY_FILTERS: {
  id: SearchCategory;
  icon: IoniconName;
  label: string;
}[] = [
  { id: "all", icon: "apps-outline", label: t("search.categories.all") },
  { id: "walk", icon: "walk-outline", label: t("search.categories.walk") },
  {
    id: "sitting",
    icon: "home-outline",
    label: t("search.categories.sitting"),
  },
  {
    id: "transport",
    icon: "car-outline",
    label: t("search.categories.transport"),
  },
  {
    id: "boarding",
    icon: "bed-outline",
    label: t("search.categories.boarding"),
  },
];

export default function SearchScreen() {
  const { accessToken, session } = useAuth();
  const meQuery = useMeQuery();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [categoryId, setCategoryId] = useState<SearchCategory>("all");
  const canUseMarketplace = hasTutorProfile(meQuery.data);
  const hasAddress = hasTutorDefaultAddress(meQuery.data);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  const categoryParam = categoryId === "all" ? undefined : categoryId;
  const providersQueryKey = useMemo(
    () => [
      "providers",
      session?.user.id,
      categoryParam ?? "all",
      debouncedQuery,
      PROVIDERS_LIMIT,
      PROVIDERS_OFFSET,
    ],
    [categoryParam, debouncedQuery, session?.user.id],
  );
  const providersQuery = useQuery({
    enabled: Boolean(accessToken && canUseMarketplace && hasAddress),
    queryKey: providersQueryKey,
    queryFn: () =>
      getProviders(accessToken, {
        categoryId: categoryParam,
        limit: PROVIDERS_LIMIT,
        offset: PROVIDERS_OFFSET,
        q: debouncedQuery || undefined,
      }),
    retry: 1,
  });

  const results = providersQuery.data ?? [];
  const isRefreshingResults =
    providersQuery.isFetching && !providersQuery.isLoading;
  const countLabel = getCountLabel({
    count: results.length,
    hasTutorProfile: canUseMarketplace,
    hasTutorAddress: hasAddress,
    hasAccessToken: Boolean(accessToken),
    isError: providersQuery.isError,
    isLoading: providersQuery.isLoading,
    isRefreshing: isRefreshingResults,
  });

  function resetFilters() {
    setQuery("");
    setDebouncedQuery("");
    setCategoryId("all");
  }

  function updateQuery(value: string) {
    setQuery(value.slice(0, PROVIDERS_SEARCH_MAX_LENGTH));
  }

  return (
    <Screen variant="top">
      <Text style={styles.title}>{t("search.title")}</Text>

      <SearchInput onChangeText={updateQuery} value={query} />

      <ScrollView
        contentContainerStyle={styles.filters}
        horizontal
        // flexGrow:0 prevents the horizontal ScrollView from absorbing
        // remaining vertical space inside the flex column (Screen→inner has
        // flex:1+gap). Without it, default `alignItems: stretch` on the
        // inner content view makes every chip child grow to the column's
        // full height — visible as the giant pill bug.
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
      >
        {CATEGORY_FILTERS.map((filter) => (
          <CategoryChip
            key={filter.id}
            icon={filter.icon}
            label={filter.label}
            onPress={() => setCategoryId(filter.id)}
            selected={categoryId === filter.id}
          />
        ))}
      </ScrollView>

      <Text style={styles.count}>{countLabel}</Text>

      {!accessToken ? (
        <EmptyState
          message={t("search.authenticated.body")}
          title={t("search.authenticated.title")}
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
        <TutorProfileRequiredState message={t("search.profileRequired.body")} />
      ) : !hasAddress ? (
        <TutorAddressRequiredState />
      ) : providersQuery.isLoading ? (
        <LoadingState label={t("search.loading")} />
      ) : providersQuery.isError ? (
        <ErrorState
          actionLabel={t("common.retry")}
          message={t("search.error.body")}
          onRetry={() => providersQuery.refetch()}
          title={t("search.error.title")}
        />
      ) : results.length === 0 ? (
        <EmptyState
          actionLabel={t("search.empty.action")}
          message={t("search.empty.body")}
          onAction={resetFilters}
          title={t("search.empty.title")}
        />
      ) : (
        <View style={styles.list}>
          {results.map((provider) => (
            <ProviderCard
              key={provider.id}
              onPress={() => router.push(`/provider/${provider.id}`)}
              provider={provider}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function getCountLabel({
  count,
  hasTutorProfile,
  hasTutorAddress,
  hasAccessToken,
  isError,
  isLoading,
  isRefreshing,
}: {
  count: number;
  hasTutorProfile: boolean;
  hasTutorAddress: boolean;
  hasAccessToken: boolean;
  isError: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
}): string {
  if (!hasAccessToken) return t("search.count.noSession");
  if (!hasTutorProfile) return t("search.count.profileRequired");
  if (!hasTutorAddress) return t("search.count.addressRequired");
  if (isLoading) return t("search.count.loading");
  if (isError) return t("search.count.error");
  if (isRefreshing) return t("search.count.refreshing");
  return count === 1 ? "1 provider found" : `${count} providers found`;
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
  },
  filtersScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filters: {
    alignItems: "center",
    gap: spacing[3],
    paddingVertical: spacing[1],
  },
  count: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "600",
  },
  list: {
    gap: spacing[3],
  },
});
