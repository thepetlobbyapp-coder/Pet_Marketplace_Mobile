import { Link, router } from 'expo-router';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthProvider';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { colors, spacing, typography } from '../../src/design/tokens';
import { t } from '../../src/i18n';

export default function SettingsScreen() {
  const { signOut } = useAuth();

  async function runSignOut() {
    await signOut();
    router.replace('/(auth)/login');
  }

  function confirmSignOut() {
    if (Platform.OS === 'web') {
      void runSignOut();
      return;
    }

    Alert.alert(t('settings.signOut.title'), t('settings.signOut.body'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.signOut.confirm'),
        style: 'destructive',
        onPress: () => {
          void runSignOut();
        },
      },
    ]);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <Text style={styles.body}>{t('settings.body')}</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>{t('settings.legal.title')}</Text>
        <Link href="/legal/terms" style={styles.link}>
          {t('legal.terms.title')}
        </Link>
        <Link href="/legal/privacy" style={styles.link}>
          {t('legal.privacy.title')}
        </Link>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>{t('settings.account.title')}</Text>
        <Text style={styles.body}>{t('settings.account.body')}</Text>
      </Card>

      <Button
        label={t('settings.signOut.button')}
        onPress={confirmSignOut}
        variant="secondary"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
  },
  body: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: '700',
    marginBottom: spacing[3],
  },
  link: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: '700',
    marginBottom: spacing[3],
  },
});
