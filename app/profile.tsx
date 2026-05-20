/**
 * Tela protegida: resumo seguro da conta a partir de GET /api/v1/me.
 * Exibe SOMENTE email/status/roles/experiência. Nunca token, telefone,
 * endereço ou coordenadas (gate MOBILE_SECURITY).
 */
import { Redirect } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useT } from '../src/i18n';
import { useSession } from '../src/session/SessionProvider';
import { primaryExperienceRole } from '../src/auth/roles';

const styles = StyleSheet.create({
  container: { padding: 24, gap: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  row: { gap: 2 },
  label: { fontSize: 13, opacity: 0.6 },
  value: { fontSize: 16, fontWeight: '500' },
  button: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e6f5c',
    alignItems: 'center',
  },
  buttonText: { color: '#1e6f5c', fontSize: 15, fontWeight: '600' },
});

export default function Profile() {
  const { state, signOut } = useSession();
  const t = useT();

  if (state.status !== 'authenticated') {
    return <Redirect href="/sign-in" />;
  }

  const { user } = state;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('profile.title')}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>{t('profile.email')}</Text>
        <Text style={styles.value}>
          {user.email ?? t('profile.noEmail')}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{t('profile.status')}</Text>
        <Text style={styles.value}>{user.status}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{t('profile.roles')}</Text>
        <Text style={styles.value}>
          {user.roles.length > 0 ? user.roles.join(', ') : '—'}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{t('profile.experience')}</Text>
        <Text style={styles.value}>{primaryExperienceRole(user)}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        style={styles.button}
        onPress={() => {
          void signOut();
        }}
      >
        <Text style={styles.buttonText}>{t('common.signOut')}</Text>
      </Pressable>
    </ScrollView>
  );
}
