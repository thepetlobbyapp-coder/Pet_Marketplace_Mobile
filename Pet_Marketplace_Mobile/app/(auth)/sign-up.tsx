import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthProvider';
import { Brandmark } from '../../src/components/Brandmark';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, radius, spacing, typography } from '../../src/design/tokens';

// Copy inline em pt-BR (politica §6 do 09_SPEC_DESIGN_SYSTEM).
// Chaves auth.signUp.* em src/i18n/en-GB.ts preservadas para o futuro.
const PASSWORD_MIN_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen() {
  const { isAuthConfigured, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedEmail = email.trim();
  const emailValid = EMAIL_REGEX.test(trimmedEmail);
  const passwordValid = password.length >= PASSWORD_MIN_LENGTH;
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit =
    isAuthConfigured &&
    emailValid &&
    passwordValid &&
    passwordsMatch &&
    termsAccepted &&
    !isSubmitting;

  const showPasswordError =
    password.length > 0 && !passwordValid;
  const showConfirmError =
    confirmPassword.length > 0 && !passwordsMatch;

  async function handleSubmit() {
    setIsSubmitting(true);
    const result = await signUp(trimmedEmail, password);
    setIsSubmitting(false);

    if (!result.ok) {
      Alert.alert(
        'Nao foi possivel criar a conta',
        result.message ?? 'Verifique os dados e tente novamente.',
      );
      return;
    }

    if (result.requiresEmailConfirmation) {
      Alert.alert(
        'Confirme seu e-mail',
        'Enviamos um link de confirmacao para o seu e-mail. Apos confirmar, voce podera entrar.',
      );
      router.replace('/(auth)/login');
      return;
    }

    router.replace('/(tabs)/home');
  }

  return (
    <Screen>
      <View style={styles.brand}>
        <Brandmark size={72} tagline="Pet care perto de voce." />
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>
          Crie sua conta para encontrar prestadores no seu condominio.
        </Text>
      </View>

      {!isAuthConfigured ? (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Cadastro indisponivel no momento</Text>
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

        <TextField
          autoCapitalize="none"
          autoComplete="password-new"
          label="Senha"
          onChangeText={setPassword}
          placeholder={`Pelo menos ${PASSWORD_MIN_LENGTH} caracteres`}
          secureTextEntry
          textContentType="newPassword"
          value={password}
        />
        {showPasswordError ? (
          <Text style={styles.errorText}>
            A senha precisa ter pelo menos {PASSWORD_MIN_LENGTH} caracteres.
          </Text>
        ) : null}

        <TextField
          autoCapitalize="none"
          autoComplete="password-new"
          label="Confirmar senha"
          onChangeText={setConfirmPassword}
          placeholder="Repita a senha"
          secureTextEntry
          textContentType="newPassword"
          value={confirmPassword}
        />
        {showConfirmError ? (
          <Text style={styles.errorText}>As senhas precisam ser iguais.</Text>
        ) : null}

        <View style={styles.termsRow}>
          <Pressable
            accessibilityLabel="Concordo com os Termos e a Privacidade"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: termsAccepted }}
            hitSlop={8}
            onPress={() => setTermsAccepted((current) => !current)}
            style={[
              styles.checkbox,
              termsAccepted ? styles.checkboxChecked : null,
            ]}
          >
            {termsAccepted ? (
              <Ionicons color={colors.onAccent} name="checkmark" size={16} />
            ) : null}
          </Pressable>
          <Text style={styles.termsText}>
            Concordo com os{' '}
            <Link href="/legal/terms" style={styles.termsLink}>
              Termos
            </Link>{' '}
            e a{' '}
            <Link href="/legal/privacy" style={styles.termsLink}>
              Privacidade
            </Link>
            .
          </Text>
        </View>

        <View style={styles.submitWrap}>
          <Button
            disabled={!canSubmit}
            isLoading={isSubmitting}
            label="Criar conta"
            onPress={handleSubmit}
          />
        </View>
      </View>

      <View style={styles.links}>
        <Link href="/(auth)/login" style={styles.link}>
          Ja tenho conta
        </Link>
      </View>
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
  errorText: {
    color: colors.danger,
    fontSize: typography.small,
    marginTop: -spacing[3],
  },
  termsRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing[3],
  },
  checkbox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginTop: 2,
    width: 24,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  termsText: {
    color: colors.muted,
    flex: 1,
    fontSize: typography.small,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.accent,
    fontWeight: '700',
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
});
