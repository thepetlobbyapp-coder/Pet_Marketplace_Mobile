import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../design/tokens';
import { Avatar } from './Avatar';

interface ConversationRowProps {
  name: string;
  service: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatarUri?: string;
  onPress?: () => void;
}

export function ConversationRow({
  name,
  service,
  lastMessage,
  time,
  unread,
  avatarUri,
  onPress,
}: ConversationRowProps) {
  return (
    <Pressable
      accessibilityHint="Abre a conversa"
      accessibilityLabel={
        unread > 0
          ? `Conversa com ${name}, ${unread} mensagens não lidas`
          : `Conversa com ${name}`
      }
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <Avatar name={name} size={52} uri={avatarUri} />
      <View style={styles.body}>
        <View style={styles.topLine}>
          <Text numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text numberOfLines={1} style={styles.service}>
          {service}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.preview, unread > 0 ? styles.previewUnread : null]}
        >
          {lastMessage}
        </Text>
      </View>
      {unread > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[3],
  },
  pressed: {
    opacity: 0.85,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  topLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    fontWeight: '700',
  },
  time: {
    color: colors.muted,
    fontSize: typography.caption,
  },
  service: {
    color: colors.accent,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  preview: {
    color: colors.muted,
    fontSize: typography.small,
  },
  previewUnread: {
    color: colors.text,
    fontWeight: '600',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 22,
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: spacing[1],
  },
  badgeText: {
    color: colors.onAccent,
    fontSize: typography.caption,
    fontWeight: '800',
  },
});
