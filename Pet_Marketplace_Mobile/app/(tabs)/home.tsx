import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategoryChip } from '../../src/components/CategoryChip';
import { CondoSelector } from '../../src/components/CondoSelector';
import { HeroBanner } from '../../src/components/HeroBanner';
import { IconButton } from '../../src/components/IconButton';
import { ProviderCard } from '../../src/components/ProviderCard';
import { Screen } from '../../src/components/Screen';
import { SearchInput } from '../../src/components/SearchInput';
import { SectionHeader } from '../../src/components/SectionHeader';
import {
  demoCategories,
  demoProviders,
  demoTutor,
} from '../../src/data/demoFixtures';
import { colors, spacing, typography } from '../../src/design/tokens';

// DEMO SEED: providers/categories come from local fixtures until the
// marketplace backend ships. See src/data/demoFixtures.ts.
export default function HomeScreen() {
  function openSearch() {
    router.push('/search');
  }

  function openProvider(providerId: string) {
    router.push(`/provider/${providerId}`);
  }

  function showNotifications() {
    Alert.alert(
      'Notificações',
      'Você não tem novas notificações no momento.',
    );
  }

  return (
    <Screen variant="top">
      <View style={styles.topRow}>
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>Olá, {demoTutor.firstName}! 👋</Text>
          <CondoSelector condominium={demoTutor.condominium} />
        </View>
        <IconButton
          accessibilityLabel="Notificações"
          icon="notifications-outline"
          onPress={showNotifications}
          showDot
        />
      </View>

      <SearchInput onPress={openSearch} />

      <ScrollView
        contentContainerStyle={styles.categories}
        horizontal
        showsHorizontalScrollIndicator={false}
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
        body="Encontre prestadores confiáveis perto do seu condomínio."
        ctaLabel="Buscar agora"
        onCtaPress={openSearch}
        title="Seu pet merece o melhor cuidado!"
      />

      <SectionHeader
        actionLabel="Ver todos"
        onActionPress={openSearch}
        title="Prestadores próximos"
      />

      <View style={styles.providerList}>
        {demoProviders.slice(0, 3).map((provider) => (
          <ProviderCard
            key={provider.id}
            onPress={() => openProvider(provider.id)}
            provider={provider}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greetingBlock: {
    flex: 1,
    gap: spacing[1],
  },
  greeting: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
  },
  categories: {
    gap: spacing[2],
    paddingVertical: spacing[1],
  },
  providerList: {
    gap: spacing[3],
  },
});
