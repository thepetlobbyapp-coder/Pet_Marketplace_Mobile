/**
 * Roteia conforme a sessão: autenticado → perfil; senão → sign-in.
 * (Estados loading/blocked/error já foram tratados no _layout.)
 */
import { Redirect } from 'expo-router';
import { useSession } from '../src/session/SessionProvider';
import { homeRouteForSession } from '../src/session/routing';

export default function Index() {
  const { state } = useSession();
  return <Redirect href={homeRouteForSession(state)} />;
}
