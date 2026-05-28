import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import {
  getDeletionRequest,
  requestDeletionRequest,
} from "../../src/api/client";
import type {
  AccountDeletionRequestResponse,
  AccountDeletionRequestStatus,
} from "../../src/api/types";
import { useAuth } from "../../src/auth/AuthProvider";
import { Button } from "../../src/components/Button";
import { Card } from "../../src/components/Card";
import { Screen } from "../../src/components/Screen";
import { colors, spacing, typography } from "../../src/design/tokens";
import { t } from "../../src/i18n";

export default function SettingsScreen() {
  const { accessToken, session, signOut } = useAuth();
  const queryClient = useQueryClient();
  const deletionQueryKey = useMemo(
    () => ["accountDeletionRequest", session?.user.id],
    [session?.user.id],
  );
  const [deletionMessage, setDeletionMessage] = useState<string | null>(null);

  const deletionQuery = useQuery({
    enabled: Boolean(accessToken),
    queryKey: deletionQueryKey,
    queryFn: () => getDeletionRequest(accessToken),
    retry: 1,
  });

  const deletionMutation = useMutation({
    mutationFn: () => requestDeletionRequest(accessToken),
    onError: () => {
      setDeletionMessage(t("settings.account.requestError"));
    },
    onSuccess: (deletionRequest) => {
      queryClient.setQueryData(deletionQueryKey, deletionRequest);
      setDeletionMessage(t("settings.account.requestSuccess"));
    },
  });

  async function runSignOut() {
    try {
      await signOut();
    } finally {
      queryClient.clear();
      setDeletionMessage(null);
      router.replace("/(auth)/login");
    }
  }

  function confirmSignOut() {
    if (Platform.OS === "web") {
      void runSignOut();
      return;
    }

    Alert.alert(t("settings.signOut.title"), t("settings.signOut.body"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.signOut.confirm"),
        style: "destructive",
        onPress: () => {
          void runSignOut();
        },
      },
    ]);
  }

  function confirmDeletionRequest() {
    if (!accessToken || deletionMutation.isPending) return;

    if (Platform.OS === "web") {
      const confirm = (
        globalThis as typeof globalThis & {
          confirm?: (message: string) => boolean;
        }
      ).confirm;
      const confirmed = confirm
        ? confirm(
            `${t("settings.account.confirmTitle")}\n\n${t(
              "settings.account.confirmBody",
            )}`,
          )
        : true;
      if (confirmed) deletionMutation.mutate();
      return;
    }

    Alert.alert(
      t("settings.account.confirmTitle"),
      t("settings.account.confirmBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.account.confirmAction"),
          style: "destructive",
          onPress: () => deletionMutation.mutate(),
        },
      ],
    );
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t("settings.title")}</Text>
        <Text style={styles.body}>{t("settings.body")}</Text>
      </View>

      <Card>
        <Text style={styles.sectionTitle}>{t("settings.legal.title")}</Text>
        <Link href="/legal/terms" style={styles.link}>
          {t("legal.terms.title")}
        </Link>
        <Link href="/legal/privacy" style={styles.link}>
          {t("legal.privacy.title")}
        </Link>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>{t("settings.account.title")}</Text>
        <Text style={styles.body}>{t("settings.account.body")}</Text>
        <DeletionRequestStatus
          deletionRequest={deletionQuery.data ?? null}
          isError={deletionQuery.isError}
          isLoading={deletionQuery.isLoading}
          isSignedIn={Boolean(accessToken)}
        />
        {deletionMessage ? (
          <Text style={styles.message}>{deletionMessage}</Text>
        ) : null}
        <Button
          disabled={!accessToken || deletionMutation.isPending}
          isLoading={deletionMutation.isPending}
          label={t("settings.account.deleteButton")}
          onPress={confirmDeletionRequest}
          variant="secondary"
        />
      </Card>

      <Button
        label={t("settings.signOut.button")}
        onPress={confirmSignOut}
        variant="secondary"
      />
    </Screen>
  );
}

function DeletionRequestStatus({
  deletionRequest,
  isError,
  isLoading,
  isSignedIn,
}: {
  deletionRequest: AccountDeletionRequestResponse | null;
  isError: boolean;
  isLoading: boolean;
  isSignedIn: boolean;
}) {
  if (!isSignedIn) {
    return <Text style={styles.body}>{t("settings.account.noSession")}</Text>;
  }

  if (isLoading) {
    return <Text style={styles.body}>{t("settings.account.loading")}</Text>;
  }

  if (isError) {
    return (
      <Text style={styles.errorText}>{t("settings.account.statusError")}</Text>
    );
  }

  if (!deletionRequest) {
    return <Text style={styles.body}>{t("settings.account.noRequest")}</Text>;
  }

  return (
    <View style={styles.statusBox}>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>{t("settings.account.status")}</Text>
        <Text style={styles.statusValue}>
          {deletionStatusLabel(deletionRequest.status)}
        </Text>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>
          {t("settings.account.requestedAt")}
        </Text>
        <Text style={styles.statusValue}>
          {formatDeletionDate(deletionRequest.requestedAt)}
        </Text>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>
          {t("settings.account.estimatedCompletionAt")}
        </Text>
        <Text style={styles.statusValue}>
          {formatDeletionDate(deletionRequest.estimatedCompletionAt)}
        </Text>
      </View>
    </View>
  );
}

function deletionStatusLabel(status: AccountDeletionRequestStatus): string {
  if (status === "pending") return t("settings.account.status.pending");
  if (status === "processing") return t("settings.account.status.processing");
  return t("settings.account.status.done");
}

function formatDeletionDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return t("common.notAvailable");

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

const styles = StyleSheet.create({
  header: {
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
  },
  body: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.body,
    lineHeight: 24,
  },
  message: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
    lineHeight: 24,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.section,
    fontWeight: "700",
    marginBottom: spacing[3],
  },
  statusBox: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: spacing[2],
    padding: spacing[3],
  },
  statusLabel: {
    color: colors.muted,
    flex: 1,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing[3],
    justifyContent: "space-between",
  },
  statusValue: {
    color: colors.text,
    flex: 1,
    fontSize: typography.caption,
    fontWeight: "800",
    textAlign: "right",
  },
  link: {
    color: colors.accent,
    fontSize: typography.body,
    fontWeight: "700",
    marginBottom: spacing[3],
  },
});
