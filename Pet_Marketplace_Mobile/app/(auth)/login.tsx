import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthProvider';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, spacing, typography } from '../../src/design/tokens';
import { t } from '../../src/i18n';

export default function LoginScreen() {
  const { isAuthConfigured, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    const result = await signIn(email.trim(), password);
    setIsSubmitting(false);

    if (!result.ok) {
      Alert.alert(t('auth.login.errorTitle'), result.message);
      return;
    }

    router.replace('/(tabs)/home');
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>{t('app.kicker')}</Text>
        <Text style={styles.title}>{t('auth.login.title')}</Text>
        <Text style={styles.body}>{t('auth.login.subtitle')}</Text>
      </View>

      {!isAuthConfigured ? (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>{t('auth.config.title')}</Text>
          <Text style={styles.noticeBody}>{t('auth.config.body')}</Text>
        </View>
      ) : null}

      <View style={styles.form}>
        <TextField
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label={t('auth.email.label')}
          onChangeText={setEmail}
          placeholder={t('auth.email.placeholder')}
          textContentType="emailAddress"
          value={email}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="password"
          label={t('auth.password.label')}
          onChangeText={setPassword}
          placeholder={t('auth.password.placeholder')}
          secureTextEntry
          textContentType="password"
          value={password}
        />
        <Button
          disabled={!isAuthConfigured || !email || !password || isSubmitting}
          isLoading={isSubmitting}
          label={t('auth.login.button')}
          onPress={handleSubmit}
        />
      </View>

      <View style={styles.links}>
        <Link href="/(auth)/sign-up" style={styles.link}>
          {t('auth.signUp.link')}
        </Link>
        <Link href="/(auth)/reset-password" style={styles.link}>
          {t('auth.reset.link')}
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  kicker: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
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
  form: {
    gap: spacing[4],
  },
  links: {
    gap: spacing[3],
    marginTop: spacing[6],
  },
  link: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: '700',
  },
  notice: {
    backgroundColor: colors.warningSurface,
    borderColor: colors.warningBorder,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing[1],
    marginBottom: spacing[5],
    padding: spacing[4],
  },
  noticeTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  noticeBody: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 20,
  },
});
