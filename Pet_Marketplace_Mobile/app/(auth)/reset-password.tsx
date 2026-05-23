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

// Copy inline em pt-BR (politica §6 do 09_SPEC_DESIGN_SYSTEM).
// Chaves auth.reset.* em src/i18n/en-GB.ts preservadas para o futuro.
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
    // resetPassword sempre retorna ok (anti email enumeration). O resultado
    // do provedor nao influencia a mensagem ao usuario.
    await resetPassword(trimmedEmail);
    setIsSubmitting(false);
    setSubmitted(true);
  }

  return (
    <Screen>
      <View style={styles.brand}>
        <Brandmark size={72} tagline="Pet care perto de voce." />
      </View>

      {submitted ? (
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Ionicons color={colors.successText} name="mail" size={36} />
          </View>
          <Text style={styles.title}>Verifique seu e-mail</Text>
          <Text style={styles.subtitle}>
            Se houver uma conta associada a esse e-mail, enviaremos um link
            para redefinir a senha. O link pode levar alguns minutos para
            chegar.
          </Text>
          <View style={styles.submitWrap}>
            <Button
              label="Voltar ao login"
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.hero}>
            <Text style={styles.title}>Redefinir senha</Text>
            <Text style={styles.subtitle}>
              Informe o e-mail da sua conta e enviaremos um link para criar
              uma nova senha.
            </Text>
          </View>

          {!isAuthConfigured ? (
            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>
                Redefinicao indisponivel no momento
              </Text>
              <Text style={styles.noticeBody}>
                Tente novamente em alguns instantes.
              </Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <TextField
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              label="E-mail"
              onChangeText={setEmail}
              placeholder="voce@exemplo.com"
              textContentType="emailAddress"
              value={email}
            />

            <View style={styles.submitWrap}>
              <Button
                disabled={!canSubmit}
                isLoading={isSubmitting}
                label="Enviar link"
                onPress={handleSubmit}
              />
            </View>
          </View>

          <View style={styles.links}>
            <Link href="/(auth)/login" style={styles.link}>
              Voltar ao login
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
    backgroundColor: '#E3F6EC',
    borderRadius: radius.pill,
    height: 72,
    justifyContent: 'center',
    width: 72,
  },
});
