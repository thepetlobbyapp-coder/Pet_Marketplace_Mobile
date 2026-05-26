import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthProvider';
import { Brandmark } from '../../src/components/Brandmark';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, radius, spacing, typography } from '../../src/design/tokens';
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
      <View style={styles.brand}>
        <Brandmark size={88} tagline={t('auth.login.tagline')} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>{t('auth.login.title')}</Text>
        <Text style={styles.subtitle}>{t('auth.login.subtitle')}</Text>
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
        <View style={styles.submitWrap}>
          <Button
            disabled={!isAuthConfigured || !email || !password || isSubmitting}
            isLoading={isSubmitting}
            label={t('auth.login.button')}
            onPress={handleSubmit}
          />
        </View>
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
  brand: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  hero: {
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  form: {
    gap: spacing[4],
  },
  submitWrap: {
    alignSelf: 'center',
    marginTop: spacing[2],
    minWidth: 200,
    width: '60%',
  },
  links: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing[6],
    justifyContent: 'center',
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
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing[1],
    marginBottom: spacing[4],
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
