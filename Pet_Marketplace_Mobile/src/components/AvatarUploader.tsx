import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from './Avatar';
import { colors, spacing, typography } from '../design/tokens';

interface AvatarUploaderProps {
  name: string;
  avatarUrl: string | null | undefined;
  accessToken: string | null;
  onChange: (avatarUrl: string | null) => void;
  size?: number;
  disabled?: boolean;
}

export function AvatarUploader({
  name,
  avatarUrl,
  size = 96,
}: AvatarUploaderProps) {
  return (
    <View style={styles.wrapper}>
      <Avatar name={name} size={size} uri={avatarUrl ?? undefined} />
      <Text style={styles.helper}>Profile photo changes are unavailable</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing[2],
  },
  helper: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: '600',
  },
});
