import { Ionicons } from '@expo/vector-icons';
import type { GestureResponderEvent } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, shadow } from '../design/tokens';

interface CenterTabButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
}

/**
 * Raised purple action button for the centre slot of the bottom tab bar,
 * matching the visual reference (Mobile02). Wraps the "Book" tab.
 */
export function CenterTabButton({ onPress }: CenterTabButtonProps) {
  return (
    <View style={styles.slot}>
      <Pressable
        accessibilityLabel="Agendar serviço"
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
      >
        <Ionicons color={colors.onAccent} name="add" size={30} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 4,
    height: 58,
    justifyContent: 'center',
    marginTop: -18,
    width: 58,
    ...shadow.md,
  },
  pressed: {
    opacity: 0.85,
  },
});
