/**
 * Tela pública de entrada. Fase 1: informativa — o fluxo de login real
 * (backend) chega em bloco futuro. Sem botão principal sem ação e sem
 * promessa de pagamento/seguro/verificação (gate Play Store).
 */
import { Redirect } from 'expo-router';
import { useT } from '../src/i18n';
import { useSession } from '../src/session/SessionProvider';
import { MessageScreen } from '../src/ui/StateScreens';

export default function SignIn() {
  const { state } = useSession();
  const t = useT();

  if (state.status === 'authenticated') {
    return <Redirect href="/profile" />;
  }

  return (
    <MessageScreen title={t('signIn.title')} body={t('signIn.body')} />
  );
}
