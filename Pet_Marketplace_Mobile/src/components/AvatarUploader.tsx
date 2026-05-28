import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ApiClientError,
  AVATAR_MAX_SIZE_BYTES,
  deleteAvatar,
  uploadAvatar,
} from "../api/client";
import type { AvatarUploadAsset } from "../api/types";
import { colors, shadow, spacing, typography } from "../design/tokens";
import { t } from "../i18n";
import { Avatar } from "./Avatar";

interface AvatarUploaderProps {
  accessToken: string | null;
  avatarUrl: string | null | undefined;
  disabled?: boolean;
  name: string;
  onChange: (avatarUrl: string | null) => void;
  size?: number;
}

const ACCEPTED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function AvatarUploader({
  accessToken,
  avatarUrl,
  disabled = false,
  name,
  onChange,
  size = 96,
}: AvatarUploaderProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const hasAvatar = Boolean(avatarUrl);
  const isInteractive = !disabled && !isBusy && Boolean(accessToken);

  async function pickFromLibrary() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert(
        t("profile.avatar.permissionTitle"),
        t("profile.avatar.permissionLibrary"),
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ["images"],
      quality: 0.8,
    });
    await handlePickerResult(result);
  }

  async function pickFromCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== ImagePicker.PermissionStatus.GRANTED) {
      Alert.alert(
        t("profile.avatar.permissionTitle"),
        t("profile.avatar.permissionCamera"),
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ["images"],
      quality: 0.8,
    });
    await handlePickerResult(result);
  }

  async function handlePickerResult(result: ImagePicker.ImagePickerResult) {
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;

    if (
      typeof asset.fileSize === "number" &&
      asset.fileSize > AVATAR_MAX_SIZE_BYTES
    ) {
      setErrorMessage(t("profile.avatar.uploadError.tooLarge"));
      return;
    }
    if (asset.mimeType && !ACCEPTED_MIME_TYPES.has(asset.mimeType)) {
      setErrorMessage(t("profile.avatar.uploadError.unsupportedType"));
      return;
    }

    const upload: AvatarUploadAsset = {
      fileName: asset.fileName ?? null,
      mimeType: asset.mimeType ?? null,
      uri: asset.uri,
    };

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
      t("profile.avatar.removeConfirmTitle"),
      t("profile.avatar.removeConfirmBody"),
      [
        { style: "cancel", text: t("common.cancel") },
        {
          onPress: () => {
            void runRemove();
          },
          style: "destructive",
          text: t("profile.avatar.remove"),
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
        onPress: () => {
          void pickFromCamera();
        },
        text: t("profile.avatar.takePhoto"),
      },
      {
        onPress: () => {
          void pickFromLibrary();
        },
        text: t("profile.avatar.chooseLibrary"),
      },
    ];

    if (hasAvatar) {
      buttons.push({
        onPress: confirmRemove,
        style: "destructive",
        text: t("profile.avatar.remove"),
      });
    }

    buttons.push({ style: "cancel", text: t("common.cancel") });
    Alert.alert(
      t("profile.avatar.actionTitle"),
      t("profile.avatar.actionBody"),
      buttons,
    );
  }

  const badgeSize = Math.max(28, Math.round(size * 0.28));
  const badgeRadius = badgeSize / 2;
  const badgeIcon = Math.round(badgeSize * 0.56);

  return (
    <View style={styles.wrapper}>
      <Pressable
        accessibilityHint={t("profile.avatar.actionBody")}
        accessibilityLabel={t("profile.avatar.changeAction")}
        accessibilityRole="button"
        accessibilityState={{ busy: isBusy, disabled: !isInteractive }}
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
            accessibilityLabel={t("profile.avatar.uploading")}
            style={[
              styles.busyOverlay,
              { borderRadius: size / 2, height: size, width: size },
            ]}
          >
            <ActivityIndicator color={colors.onAccent} />
          </View>
        ) : isInteractive ? (
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
            <Ionicons color={colors.onAccent} name="camera" size={badgeIcon} />
          </View>
        ) : null}
      </Pressable>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

function formatUploadError(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (error.status === 401) return t("profile.avatar.uploadError.auth");
    if (error.status === 413) return t("profile.avatar.uploadError.tooLarge");
    if (error.status === 415) {
      return t("profile.avatar.uploadError.unsupportedType");
    }
    if (error.status === 503) return t("profile.avatar.uploadError.storage");
    if (error.status === 400) {
      const msg = error.message?.toLowerCase() ?? "";
      if (msg.includes("dimension")) {
        return t("profile.avatar.uploadError.dimensions");
      }
      if (msg.includes("required") || msg.includes("image")) {
        return t("profile.avatar.uploadError.missing");
      }
    }
    return `${t("profile.avatar.uploadError.generic")} (HTTP ${error.status})`;
  }

  if (isAbortError(error)) return t("profile.avatar.uploadError.network");
  return t("profile.avatar.uploadError.network");
}

function formatDeleteError(error: unknown): string {
  if (error instanceof ApiClientError && error.status === 401) {
    return t("profile.avatar.deleteError.auth");
  }
  return t("profile.avatar.deleteError.generic");
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  return (error as { name?: unknown }).name === "AbortError";
}

const styles = StyleSheet.create({
  badge: {
    ...shadow.sm,
    alignItems: "center",
    backgroundColor: colors.accent,
    borderColor: colors.surface,
    borderWidth: 2,
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    right: 0,
  },
  busyOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(17, 17, 34, 0.55)",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    top: 0,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: "700",
    textAlign: "center",
  },
  pressable: {
    position: "relative",
  },
  pressed: {
    opacity: 0.85,
  },
  wrapper: {
    alignItems: "center",
    gap: spacing[2],
  },
});
