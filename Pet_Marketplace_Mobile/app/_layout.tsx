import 'react-native-gesture-handler';
import '../src/lib/supabase-polyfills';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '../src/providers/AppProviders';
import { colors } from '../src/design/tokens';
import { t } from '../src/i18n';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="legal/terms"
          options={{ title: t('legal.terms.title') }}
        />
        <Stack.Screen
          name="legal/privacy"
          options={{ title: t('legal.privacy.title') }}
        />
        <Stack.Screen
          name="provider/[id]"
          options={{ title: 'Detalhes do prestador' }}
        />
      </Stack>
    </AppProviders>
  );
}
