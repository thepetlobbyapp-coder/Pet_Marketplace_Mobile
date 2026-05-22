import { Stack } from 'expo-router';
import { t } from '../../src/i18n';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ title: t('auth.login.title'), headerShown: false }}
      />
      <Stack.Screen
        name="sign-up"
        options={{ title: t('auth.signUp.title') }}
      />
      <Stack.Screen
        name="reset-password"
        options={{ title: t('auth.reset.title') }}
      />
    </Stack>
  );
}
