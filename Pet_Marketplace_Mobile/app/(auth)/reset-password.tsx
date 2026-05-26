import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthProvider';
import { Brandmark } from '../../src/components/Brandmark';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, radius, spacing, typography } from '../../src/design/tokens';
import { t } from '../../src/i18n';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ResetPasswordScreen() {
  const { isAuthConfigured, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const trimmedEmail = email.trim();
  const emailValid = EMAIL_REGEX.test(trimmedEmail);
  const canSubmit = isAuthConfigured && emailValid && !isSubmitting;

  async function handleSubmit() {
    setIsSubmitting(true);
    // resetPassword always returns ok to avoid email enumeration.
    await resetPassword(trimmedEmail);
    setIsSubmitting(false);
    setSubmitted(true);
  }

  return (
    <Screen>
      <View style={styles.brand}>
        <Brandmark size={72} tagline={t('auth.login.tagline')} />
      </View>

      {submitted ? (
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Ionicons color={colors.successText} name="mail" size={36} />
          </View>
          <Text style={styles.title}>{t('auth.reset.successTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.reset.successBody')}</Text>
          <View style={styles.submitWrap}>
            <Button
              label={t('auth.reset.successButton')}
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.hero}>
            <Text style={styles.title}>{t('auth.reset.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.reset.body')}</Text>
          </View>

          {!isAuthConfigured ? (
            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>
                {t('auth.reset.unavailableTitle')}
              </Text>
              <Text style={styles.noticeBody}>{t('auth.unavailable.body')}</Text>
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

            <View style={styles.submitWrap}>
              <Button
                disabled={!canSubmit}
                isLoading={isSubmitting}
                label={t('auth.reset.submit')}
                onPress={handleSubmit}
              />
            </View>
          </View>

          <View style={styles.links}>
            <Link href="/(auth)/login" style={styles.link}>
              {t('auth.reset.backToLogin')}
            </Link>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  hero: {
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
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
    marginBottom: spacing[3],
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
  successWrap: {
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
  },
  successIcon: {
    alignItems: 'center',
    backgroundColor: colors.successSurface,
    borderRadius: radius.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
});
