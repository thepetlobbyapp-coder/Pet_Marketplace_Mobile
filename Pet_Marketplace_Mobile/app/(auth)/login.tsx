import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthProvider';
import { Brandmark } from '../../src/components/Brandmark';
import { Button } from '../../src/components/Button';
import { Screen } from '../../src/components/Screen';
import { TextField } from '../../src/components/TextField';
import { colors, radius, spacing, typography } from '../../src/design/tokens';

// Copy inline em pt-BR para alinhar com as telas do marketplace.
// As chaves auth.* de src/i18n/en-GB.ts foram preservadas para uso futuro.
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
      Alert.alert('Não foi possível entrar', result.message);
      return;
    }

    router.replace('/(tabs)/home');
  }

  return (
    <Screen>
      <View style={styles.brand}>
        <Brandmark size={88} tagline="Pet care perto de você." />
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>Bem-vindo de volta</Text>
        <Text style={styles.subtitle}>
          Entre para gerenciar a conta do seu pet.
        </Text>
      </View>

      {!isAuthConfigured ? (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Login indisponível no momento</Text>
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
          autoComplete="password"
          label="Senha"
          onChangeText={setPassword}
          placeholder="Digite sua senha"
          secureTextEntry
          textContentType="password"
          value={password}
        />
        <View style={styles.submitWrap}>
          <Button
            disabled={!isAuthConfigured || !email || !password || isSubmitting}
            isLoading={isSubmitting}
            label="Entrar"
            onPress={handleSubmit}
          />
        </View>
      </View>

      <View style={styles.links}>
        <Link href="/(auth)/sign-up" style={styles.link}>
          Criar conta
        </Link>
        <Link href="/(auth)/reset-password" style={styles.link}>
          Esqueci a senha
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
