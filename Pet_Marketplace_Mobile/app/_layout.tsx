/**
 * Layout raiz: providers + gate global de sessão.
 *
 * Estados não navegáveis (loading/blocked/error) são renderizados aqui,
 * direto, para nunca deixar uma rota protegida montar sem sessão válida.
 */
import { useMemo } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nProvider, useT } from '../src/i18n';
import { SessionProvider, useSession } from '../src/session/SessionProvider';
import { LoadingScreen, MessageScreen } from '../src/ui/StateScreens';

function SessionGate() {
  const { state, retry } = useSession();
  const t = useT();

  switch (state.status) {
    case 'idle':
    case 'bootstrapping':
      return <LoadingScreen label={t('session.loading')} />;
    case 'blocked':
      return (
        <MessageScreen
          title={t('auth.blockedTitle')}
          body={t('auth.blockedBody')}
        />
      );
    case 'error':
      return (
        <MessageScreen
          title={t('error.offlineTitle')}
          body={
            state.kind === 'offline'
              ? t('error.offlineBody')
              : state.kind === 'timeout'
                ? t('error.timeoutBody')
                : t('error.unknownBody')
          }
          actionLabel={t('common.retry')}
          onAction={retry}
        />
      );
    default:
      // authenticated | unauthenticated → as rotas decidem o redirect.
      return <Slot />;
  }
}

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <SessionProvider>
            <StatusBar style="auto" />
            <SessionGate />
          </SessionProvider>
        </I18nProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
