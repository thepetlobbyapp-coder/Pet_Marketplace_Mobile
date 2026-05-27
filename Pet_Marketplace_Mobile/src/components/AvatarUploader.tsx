import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ApiClientError,
  AVATAR_MAX_SIZE_BYTES,
  deleteAvatar,
  uploadAvatar,
} from '../api/client';
import type { AvatarUploadAsset } from '../api/types';
import { colors, shadow, spacing, typography } from '../design/tokens';
import { t } from '../i18n';
import { Avatar } from './Avatar';

interface AvatarUploaderProps {
  name: string;
  avatarUrl: string | null | undefined;
  accessToken: string | null;
  /** Called with the new signed URL on upload success, or `null` on delete. */
  onChange: (avatarUrl: string | null) => void;
  size?: number;
  disabled?: boolean;
}

const ACCEPTED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

/**
 * Tap-to-change avatar. Wraps the read-only `Avatar` with:
 *  - a pencil/camera badge to advertise the affordance;
 *  - a native action sheet (Alert.alert — works on iOS + Android without an
 *    extra dependency) offering camera, library and remove;
 *  - upload + delete wired to the existing `/me/avatar` endpoints.
 *
 * The component owns its own loading + error states so the screen above
 * just feeds it `accessToken` and an `onChange` callback to keep the
 * `meQuery` cache in sync.
 */
export function AvatarUploader({
  name,
  avatarUrl,
  accessToken,
  onChange,
  size = 96,
  disabled = false,
}: AvatarUploaderProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasAvatar = Boolean(avatarUrl);
  const isInteractive = !disabled && !isBusy && Boolean(accessToken);

  async function pickFromLibrary() {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert(
        t('profile.avatar.permissionTitle'),
        t('profile.avatar.permissionLibrary'),
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    await handlePickerResult(result);
  }

  async function pickFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert(
        t('profile.avatar.permissionTitle'),
        t('profile.avatar.permissionCamera'),
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    await handlePickerResult(result);
  }

  async function handlePickerResult(result: ImagePicker.ImagePickerResult) {
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;

    // Some picker backends know the file size; reject locally so we never
    // burn a slow upload that the API would just reject with 413.
    if (
      typeof asset.fileSize === 'number' &&
      asset.fileSize > AVATAR_MAX_SIZE_BYTES
    ) {
      setErrorMessage(t('profile.avatar.uploadError.tooLarge'));
      return;
    }
    if (asset.mimeType && !ACCEPTED_MIME_TYPES.has(asset.mimeType)) {
      setErrorMessage(t('profile.avatar.uploadError.unsupportedType'));
      return;
    }

    const upload: AvatarUploadAsset = {
      uri: asset.uri,
      mimeType: asset.mimeType ?? null,
      fileName: asset.fileName ?? null,
    };

    // Debug-only signal (no PII): the URI scheme tells us whether the
    // picker handed us a `file://` path the fetch layer can read, or a
    // `content://` URI that some Android backends can't stream directly.
    const uriScheme = asset.uri.match(/^([a-z]+):/i)?.[1] ?? 'unknown';
    console.info('[avatar.upload] starting', {
      uriScheme,
      hasMime: Boolean(asset.mimeType),
      hasFileName: Boolean(asset.fileName),
      sizeKb:
        typeof asset.fileSize === 'number'
          ? Math.round(asset.fileSize / 1024)
          : null,
    });

    setErrorMessage(null);
    setIsBusy(true);
    try {
      const response = await uploadAvatar(accessToken, upload);
      onChange(response.avatarUrl);
    } catch (error) {
      setErrorMessage(formatUploadError(error));
    } finally {
      setIsBusy(false);
    }
  }

  function confirmRemove() {
    Alert.alert(
      t('profile.avatar.removeConfirmTitle'),
      t('profile.avatar.removeConfirmBody'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.avatar.remove'),
          style: 'destructive',
          onPress: () => {
            void runRemove();
          },
        },
      ],
    );
  }

  async function runRemove() {
    setErrorMessage(null);
    setIsBusy(true);
    try {
      await deleteAvatar(accessToken);
      onChange(null);
    } catch (error) {
      setErrorMessage(formatDeleteError(error));
    } finally {
      setIsBusy(false);
    }
  }

  function openActionSheet() {
    if (!isInteractive) return;
    const buttons: Parameters<typeof Alert.alert>[2] = [
      {
        text: t('profile.avatar.takePhoto'),
        onPress: () => {
          void pickFromCamera();
        },
      },
      {
        text: t('profile.avatar.chooseLibrary'),
        onPress: () => {
          void pickFromLibrary();
        },
      },
    ];
    if (hasAvatar) {
      buttons.push({
        text: t('profile.avatar.remove'),
        style: 'destructive',
        onPress: confirmRemove,
      });
    }
    buttons.push({ text: t('common.cancel'), style: 'cancel' });
    Alert.alert(
      t('profile.avatar.actionTitle'),
      t('profile.avatar.actionBody'),
      buttons,
    );
  }

  const badgeSize = Math.max(28, Math.round(size * 0.28));
  const badgeRadius = badgeSize / 2;
  const badgeIcon = Math.round(badgeSize * 0.56);

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityHint={t('profile.avatar.actionBody')}
        accessibilityLabel={t('profile.avatar.changeAction')}
        accessibilityRole="button"
        accessibilityState={{ disabled: !isInteractive, busy: isBusy }}
        disabled={!isInteractive}
        hitSlop={8}
        onPress={openActionSheet}
        style={({ pressed }) => [
          styles.pressable,
          pressed && isInteractive ? styles.pressed : null,
        ]}
      >
        <Avatar name={name} size={size} uri={avatarUrl ?? undefined} />
        {isBusy ? (
          <View
            accessibilityLabel={t('profile.avatar.uploading')}
            style={[
              styles.busyOverlay,
              { borderRadius: size / 2, height: size, width: size },
            ]}
          >
            <ActivityIndicator color={colors.onAccent} />
          </View>
        ) : (
          <View
            pointerEvents="none"
            style={[
              styles.badge,
              {
                borderRadius: badgeRadius,
                height: badgeSize,
                width: badgeSize,
              },
            ]}
          >
            <Ionicons
              color={colors.onAccent}
              name="camera"
              size={badgeIcon}
            />
          </View>
        )}
      </Pressable>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

function formatUploadError(error: unknown): string {
  if (error instanceof ApiClientError) {
    // One-liner with no PII (no URI, no mime, no filename) so we can debug
    // unexpected statuses without leaking user content.
    console.warn('[avatar.upload] failed', {
      status: error.status,
      code: error.code,
    });
    if (error.status === 401) return t('profile.avatar.uploadError.auth');
    if (error.status === 413) return t('profile.avatar.uploadError.tooLarge');
    if (error.status === 415) {
      return t('profile.avatar.uploadError.unsupportedType');
    }
    if (error.status === 503) {
      return t('profile.avatar.uploadError.storage');
    }
    // The backend uses 400 with a structured `code` for two distinct
    // validation paths (see backend `dto/avatar.dto.ts`). Surface them
    // with actionable copy so the user knows what to change.
    if (error.status === 400) {
      const msg = error.message?.toLowerCase() ?? '';
      if (msg.includes('dimension')) {
        return t('profile.avatar.uploadError.dimensions');
      }
      if (msg.includes('required') || msg.includes('image')) {
        return t('profile.avatar.uploadError.missing');
      }
    }
    // Fallback exposes the HTTP status so unknown server-side rejections
    // are diagnosable from a screenshot.
    return `${t('profile.avatar.uploadError.generic')} (HTTP ${error.status})`;
  }
  if (isAbortError(error)) {
    return t('profile.avatar.uploadError.network');
  }
  // Surface the raw `message` and `name` for non-ApiClientError failures —
  // that's where RN's fetch tucks "Network request failed", "Could not
  // connect", "ENOENT" etc. No PII because the picker URI never reaches
  // here, only the thrown Error.
  console.warn('[avatar.upload] non-api error', {
    name: error instanceof Error ? error.name : typeof error,
    message: error instanceof Error ? error.message : String(error),
  });
  return t('profile.avatar.uploadError.network');
}

function formatDeleteError(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (error.status === 401) return t('profile.avatar.deleteError.auth');
  }
  return t('profile.avatar.deleteError.generic');
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  return (error as { name?: unknown }).name === 'AbortError';
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: spacing[2],
  },
  pressable: {
    position: 'relative',
  },
  pressed: {
    opacity: 0.85,
  },
  busyOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 17, 34, 0.55)',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderColor: colors.surface,
    borderWidth: 2,
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    ...shadow.sm,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '700',
    textAlign: 'center',
  },
});
