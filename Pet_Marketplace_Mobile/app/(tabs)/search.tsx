import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { FilterPill } from '../../src/components/FilterPill';
import { ProviderCard } from '../../src/components/ProviderCard';
import { Screen } from '../../src/components/Screen';
import { SearchInput } from '../../src/components/SearchInput';
import { demoCategories, demoProviders } from '../../src/data/demoFixtures';
import { colors, spacing, typography } from '../../src/design/tokens';

// DEMO SEED: provider results come from local fixtures until the marketplace
// search backend ships. See src/data/demoFixtures.ts.
export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');

  const filters = useMemo(
    () => [
      { id: 'all', label: 'Todos' },
      ...demoCategories
        .filter((category) => category.id !== 'more')
        .map((category) => ({ id: category.id, label: category.label })),
    ],
    [],
  );

  const results = useMemo(() => {
    const text = query.trim().toLowerCase();
    return demoProviders.filter((provider) => {
      const matchesCategory =
        categoryId === 'all' || provider.categoryId === categoryId;
      const matchesText =
        text.length === 0 ||
        provider.name.toLowerCase().includes(text) ||
        provider.service.toLowerCase().includes(text);
      return matchesCategory && matchesText;
    });
  }, [query, categoryId]);

  function resetFilters() {
    setQuery('');
    setCategoryId('all');
  }

  return (
    <Screen variant="top">
      <Text style={styles.title}>Buscar prestadores</Text>

      <SearchInput onChangeText={setQuery} value={query} />

      <ScrollView
        contentContainerStyle={styles.filters}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((filter) => (
          <FilterPill
            key={filter.id}
            label={filter.label}
            onPress={() => setCategoryId(filter.id)}
            selected={categoryId === filter.id}
          />
        ))}
      </ScrollView>

      <Text style={styles.count}>
        {results.length === 1
          ? '1 prestador encontrado'
          : `${results.length} prestadores encontrados`}
      </Text>

      {results.length === 0 ? (
        <EmptyState
          actionLabel="Limpar filtros"
          message="Tente outra categoria ou ajuste a sua busca."
          onAction={resetFilters}
          title="Nenhum prestador encontrado"
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

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
  },
  filters: {
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  count: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: '600',
  },
  list: {
    gap: spacing[3],
  },
});
