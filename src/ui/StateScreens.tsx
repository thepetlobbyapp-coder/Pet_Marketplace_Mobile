/**
 * Telas de estado reutilizáveis (loading / mensagem com ação).
 * Texto sempre via i18n; nunca exibir token/endereço/coordenadas.
 */
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center' },
  body: { fontSize: 15, textAlign: 'center', opacity: 0.7 },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#1e6f5c',
  },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

export function LoadingScreen({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.body}>{label}</Text>
    </View>
  );
}

export function MessageScreen({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={onAction}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
