import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "../design/tokens";

interface ScreenProps {
  children: ReactNode;
  // 'centered' (default) keeps short placeholder content vertically centred.
  // 'top' anchors content to the top for scrollable, content-rich screens.
  variant?: "centered" | "top";
}

export function Screen({ children, variant = "centered" }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.inner,
            variant === "top" ? styles.innerTop : styles.innerCentered,
          ]}
        >
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing[5],
  },
  inner: {
    flex: 1,
    gap: spacing[4],
    width: "100%",
  },
  innerCentered: {
    justifyContent: "center",
  },
  innerTop: {
    justifyContent: "flex-start",
  },
});
