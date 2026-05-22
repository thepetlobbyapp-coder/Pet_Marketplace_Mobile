import { Redirect } from 'expo-router';
import { LoadingState } from '../src/components/LoadingState';
import { Screen } from '../src/components/Screen';
import { useAuth } from '../src/auth/AuthProvider';
import { t } from '../src/i18n';

export default function IndexRoute() {
  const { isInitialising, session } = useAuth();

  if (isInitialising) {
    return (
      <Screen>
        <LoadingState label={t('session.loading')} />
      </Screen>
    );
  }

  return session ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}
