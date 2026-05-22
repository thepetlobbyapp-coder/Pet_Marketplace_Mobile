import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../design/tokens';

interface SearchInputProps extends Pick<TextInputProps, 'value' | 'onChangeText'> {
  placeholder?: string;
  accessibilityLabel?: string;
  // When provided, the field renders as a non-editable button (e.g. on Home,
  // tapping it navigates to the Search screen).
  onPress?: () => void;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Buscar serviços, prestadores...',
  accessibilityLabel = 'Buscar',
  onPress,
}: SearchInputProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityHint="Abre a busca de prestadores"
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="search"
        onPress={onPress}
        style={({ pressed }) => [styles.field, pressed ? styles.pressed : null]}
      >
        <Ionicons color={colors.muted} name="search-outline" size={20} />
        <TextInput
          editable={false}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          pointerEvents="none"
          style={styles.input}
        />
      </Pressable>
    );
  }

  return (
    <View style={styles.field}>
      <Ionicons color={colors.muted} name="search-outline" size={20} />
      <TextInput
        accessibilityLabel={accessibilityLabel}
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        returnKeyType="search"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[2],
    minHeight: 48,
    paddingHorizontal: spacing[4],
  },
  pressed: {
    opacity: 0.7,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    paddingVertical: spacing[3],
  },
});
