import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ApiClientError,
  blockConversation,
  createConversationMessage,
  createReport,
  getConversationMessages,
  getConversations,
  getProvider,
} from "../../src/api/client";
import type {
  ConversationResponse,
  MessageResponse,
  ProviderResponse,
  ReportCategory,
} from "../../src/api/types";
import {
  hasProviderProfile,
  hasTutorProfile,
  useMeQuery,
} from "../../src/api/useMeQuery";
import { useAuth } from "../../src/auth/AuthProvider";
import { Avatar } from "../../src/components/Avatar";
import { ConversationRow } from "../../src/components/ConversationRow";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorState } from "../../src/components/ErrorState";
import { LoadingState } from "../../src/components/LoadingState";
import { MessageBubble } from "../../src/components/MessageBubble";
import { TutorProfileRequiredState } from "../../src/components/ProfileRequiredState";
import { Screen } from "../../src/components/Screen";
import { colors, radius, spacing, typography } from "../../src/design/tokens";
import { t } from "../../src/i18n";

const MESSAGE_MAX_LENGTH = 2000;
type TranslationKey = Parameters<typeof t>[0];
const REPORT_CATEGORY_OPTIONS: {
  category: ReportCategory;
  labelKey: TranslationKey;
}[] = [
  {
    category: "safety_concern",
    labelKey: "chat.report.category.safetyConcern",
  },
  { category: "harassment", labelKey: "chat.report.category.harassment" },
  { category: "spam_scam", labelKey: "chat.report.category.spamScam" },
  {
    category: "inappropriate_behaviour",
    labelKey: "chat.report.category.inappropriateBehaviour",
  },
  { category: "no_show", labelKey: "chat.report.category.noShow" },
  { category: "other", labelKey: "chat.report.category.other" },
];

interface ReportTargetInput {
  category: ReportCategory;
  targetId: string;
  targetType: "conversation" | "message";
}

export default function ChatScreen() {
  const { accessToken, session } = useAuth();
  const meQuery = useMeQuery();
  const userId = session?.user.id;
  const canUseChat =
    hasTutorProfile(meQuery.data) || hasProviderProfile(meQuery.data);
  const [openConversation, setOpenConversation] =
    useState<ConversationResponse | null>(null);
  const params = useLocalSearchParams<{ conversationId?: string }>();
  const conversationIdParam =
    typeof params.conversationId === "string" ? params.conversationId : null;
  const consumedDeepLinkRef = useRef<string | null>(null);

  const conversationsQuery = useQuery({
    enabled: Boolean(accessToken && canUseChat),
    queryKey: ["conversations", userId],
    queryFn: () => getConversations(accessToken),
    refetchInterval: 3000,
    retry: 1,
  });

  // Deep-link: quando o tutor chega via `/chat?conversationId=...` (ex.: botão
  // "Conversar" do perfil do provider), abre a thread automaticamente assim
  // que a lista carregar. Cada conversationId só é consumido uma vez (via ref)
  // para que o tutor possa voltar e navegar livremente sem reabertura
  // involuntária. O setState aqui é deliberado — bridge entre o roteador
  // (sistema externo) e a UI state — e está propriamente gated pelo ref.
  useEffect(() => {
    if (!conversationIdParam) return;
    if (consumedDeepLinkRef.current === conversationIdParam) return;
    const conversations = conversationsQuery.data;
    if (!conversations) return;
    const match = conversations.find((c) => c.id === conversationIdParam);
    if (!match) return;

    consumedDeepLinkRef.current = conversationIdParam;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- bridge controlado de URL param → UI state, deduplicado pelo ref.
    setOpenConversation(match);
    router.setParams({ conversationId: undefined });
  }, [conversationIdParam, conversationsQuery.data]);

  if (!accessToken) {
    return (
      <Screen>
        <EmptyState
          message={t("chat.authenticated.body")}
          title={t("chat.authenticated.title")}
        />
      </Screen>
    );
  }

  if (conversationsQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label={t("chat.conversations.loading")} />
      </Screen>
    );
  }

  if (meQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label={t("profile.loading")} />
      </Screen>
    );
  }

  if (meQuery.isError) {
    return (
      <Screen>
        <ErrorState
          actionLabel={t("common.retry")}
          message={t("profile.error")}
          onRetry={() => meQuery.refetch()}
          title={t("common.error")}
        />
      </Screen>
    );
  }

  if (!canUseChat) {
    return (
      <Screen>
        <TutorProfileRequiredState message={t("chat.profileRequired.body")} />
      </Screen>
    );
  }

  if (openConversation) {
    return (
      <ChatThread
        accessToken={accessToken}
        conversation={openConversation}
        onBack={() => setOpenConversation(null)}
        userId={userId}
      />
    );
  }

  if (conversationsQuery.isError) {
    return (
      <Screen>
        <ErrorState
          actionLabel={t("common.retry")}
          message={getConversationListErrorMessage(conversationsQuery.error)}
          onRetry={() => conversationsQuery.refetch()}
          title={t("chat.conversations.errorTitle")}
        />
      </Screen>
    );
  }

  const conversations = conversationsQuery.data ?? [];

  return (
    <Screen variant="top">
      <Text style={styles.title}>{t("chat.title")}</Text>
      {conversations.length === 0 ? (
        <EmptyState
          message={t("chat.empty.body")}
          title={t("chat.empty.title")}
        />
      ) : (
        <View style={styles.list}>
          {conversations.map((conversation) => (
            <ConversationListItem
              accessToken={accessToken}
              conversation={conversation}
              key={conversation.id}
              onPress={() => setOpenConversation(conversation)}
              userId={userId}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

function ConversationListItem({
  accessToken,
  conversation,
  onPress,
  userId,
}: {
  accessToken: string | null;
  conversation: ConversationResponse;
  onPress: () => void;
  userId?: string;
}) {
  const providerQuery = useProviderQuery({
    accessToken,
    enabled: isTutorConversationView(conversation),
    providerId: conversation.providerId,
    userId,
  });
  const provider = providerQuery.data;
  const providerName = getCounterpartName(conversation, provider);
  const service = getCounterpartService(conversation, provider);
  const avatarUri = getCounterpartAvatarUri(conversation, provider);

  return (
    <ConversationRow
      avatarUri={avatarUri}
      lastMessage={conversation.lastMessage ?? t("chat.noMessagesYet")}
      name={providerName}
      onPress={onPress}
      service={service}
      time={formatChatTime(conversation.lastTime)}
      unread={conversation.unread ? 1 : 0}
    />
  );
}

function ChatThread({
  accessToken,
  conversation,
  onBack,
  userId,
}: {
  accessToken: string | null;
  conversation: ConversationResponse;
  onBack: () => void;
  userId?: string;
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [safetyMessage, setSafetyMessage] = useState<string | null>(null);
  const [isReportPanelOpen, setReportPanelOpen] = useState(false);
  const [isBlockConfirmOpen, setBlockConfirmOpen] = useState(false);
  const [isConversationBlocked, setConversationBlocked] = useState(false);
  const messagesQueryKey = useMemo(
    () => ["conversationMessages", userId, conversation.id],
    [conversation.id, userId],
  );
  const conversationsQueryKey = useMemo(
    () => ["conversations", userId],
    [userId],
  );
  const providerQuery = useProviderQuery({
    accessToken,
    enabled: isTutorConversationView(conversation),
    providerId: conversation.providerId,
    userId,
  });
  const messagesQuery = useQuery({
    enabled: Boolean(accessToken),
    queryKey: messagesQueryKey,
    queryFn: () => getConversationMessages(accessToken, conversation.id),
    refetchInterval: 2000,
    retry: 1,
  });
  const sendMutation = useMutation({
    mutationFn: (text: string) =>
      createConversationMessage(accessToken, conversation.id, { text }),
    onError: (error) => {
      if (error instanceof ApiClientError && error.status === 403) {
        setConversationBlocked(true);
      }
      setSendError(getSendMessageErrorMessage(error));
    },
    onSuccess: (message) => {
      queryClient.setQueryData<MessageResponse[]>(
        messagesQueryKey,
        (current) => [...(current ?? []), message],
      );
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
      setDraft("");
      setSendError(null);
    },
  });
  const reportMutation = useMutation({
    mutationFn: (input: ReportTargetInput) =>
      createReport(accessToken, {
        category: input.category,
        targetId: input.targetId,
        targetType: input.targetType,
      }),
    onMutate: () => {
      setSafetyMessage(null);
    },
    onError: (error) => {
      setSafetyMessage(getReportErrorMessage(error));
    },
    onSuccess: (_report, input) => {
      setReportPanelOpen(false);
      setSafetyMessage(
        input.targetType === "message"
          ? t("chat.report.success.message")
          : t("chat.report.success.conversation"),
      );
    },
  });
  const blockMutation = useMutation({
    mutationFn: () => blockConversation(accessToken, conversation.id),
    onError: (error) => {
      setSafetyMessage(getBlockErrorMessage(error));
    },
    onSuccess: () => {
      setBlockConfirmOpen(false);
      setConversationBlocked(true);
      setSafetyMessage(t("chat.block.success"));
    },
  });

  const provider = providerQuery.data;
  const providerName = getCounterpartName(conversation, provider);
  const service = getCounterpartService(conversation, provider);
  const avatarUri = getCounterpartAvatarUri(conversation, provider);
  const trimmedDraft = draft.trim();
  const canSend =
    Boolean(accessToken) &&
    trimmedDraft.length > 0 &&
    trimmedDraft.length <= MESSAGE_MAX_LENGTH &&
    !isConversationBlocked &&
    !sendMutation.isPending;

  function sendMessage() {
    if (!canSend) return;
    sendMutation.mutate(trimmedDraft);
  }

  return (
    <SafeAreaView style={styles.threadSafe}>
      <View style={styles.threadHeader}>
        <Pressable
          accessibilityLabel={t("chat.accessibility.backToConversations")}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
        >
          <Ionicons color={colors.text} name="chevron-back" size={26} />
        </Pressable>
        <Avatar name={providerName} size={40} uri={avatarUri} />
        <View style={styles.threadHeaderText}>
          <Text numberOfLines={1} style={styles.threadName}>
            {providerName}
          </Text>
          <Text numberOfLines={1} style={styles.threadService}>
            {service}
          </Text>
        </View>
        <View style={styles.threadActions}>
          <Pressable
            accessibilityLabel={t("chat.accessibility.reportConversation")}
            accessibilityRole="button"
            disabled={reportMutation.isPending}
            hitSlop={8}
            onPress={() => {
              setBlockConfirmOpen(false);
              setSafetyMessage(null);
              setReportPanelOpen((current) => !current);
            }}
            style={styles.headerIconButton}
          >
            <Ionicons color={colors.muted} name="flag-outline" size={20} />
          </Pressable>
          <Pressable
            accessibilityLabel={t("chat.accessibility.blockConversation")}
            accessibilityRole="button"
            disabled={blockMutation.isPending || isConversationBlocked}
            hitSlop={8}
            onPress={() => {
              setReportPanelOpen(false);
              setSafetyMessage(null);
              setBlockConfirmOpen((current) => !current);
            }}
            style={[
              styles.headerIconButton,
              isConversationBlocked ? styles.headerIconButtonDisabled : null,
            ]}
          >
            <Ionicons color={colors.danger} name="ban-outline" size={20} />
          </Pressable>
        </View>
      </View>

      {isReportPanelOpen ? (
        <View style={styles.safetyPanel}>
          <Text style={styles.safetyTitle}>{t("chat.report.title")}</Text>
          <View style={styles.categoryGrid}>
            {REPORT_CATEGORY_OPTIONS.map((option) => (
              <Pressable
                accessibilityRole="button"
                disabled={reportMutation.isPending}
                key={option.category}
                onPress={() =>
                  reportMutation.mutate({
                    category: option.category,
                    targetId: conversation.id,
                    targetType: "conversation",
                  })
                }
                style={styles.categoryButton}
              >
                <Text style={styles.categoryButtonText}>
                  {t(option.labelKey)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {isBlockConfirmOpen ? (
        <View style={styles.safetyPanel}>
          <Text style={styles.safetyTitle}>{t("chat.block.title")}</Text>
          <Text style={styles.safetyCopy}>{t("chat.block.body")}</Text>
          <View style={styles.safetyRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setBlockConfirmOpen(false)}
              style={styles.secondarySafetyButton}
            >
              <Text style={styles.secondarySafetyText}>
                {t("common.cancel")}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={blockMutation.isPending}
              onPress={() => blockMutation.mutate()}
              style={styles.dangerSafetyButton}
            >
              <Text style={styles.dangerSafetyText}>
                {blockMutation.isPending
                  ? t("chat.block.blocking")
                  : t("chat.block.action")}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.threadFlex}
      >
        <ScrollView
          contentContainerStyle={styles.thread}
          showsVerticalScrollIndicator={false}
        >
          {messagesQuery.isLoading ? (
            <LoadingState label={t("chat.messages.loading")} />
          ) : messagesQuery.isError ? (
            <ErrorState
              actionLabel={t("common.retry")}
              message={getMessagesErrorMessage(messagesQuery.error)}
              onRetry={() => messagesQuery.refetch()}
              title={t("chat.messages.errorTitle")}
            />
          ) : messagesQuery.data && messagesQuery.data.length > 0 ? (
            messagesQuery.data.map((message) => (
              <MessageBubble
                fromProvider={
                  conversation.viewerIsProvider
                    ? !message.fromProvider
                    : message.fromProvider
                }
                isReportPending={reportMutation.isPending}
                key={message.id}
                onReport={() => {
                  setReportPanelOpen(false);
                  setBlockConfirmOpen(false);
                  reportMutation.mutate({
                    category: "other",
                    targetId: message.id,
                    targetType: "message",
                  });
                }}
                text={message.text}
                time={formatChatTime(message.time)}
              />
            ))
          ) : (
            <EmptyState
              message={t("chat.messages.empty.body")}
              title={t("chat.messages.empty.title")}
            />
          )}
        </ScrollView>

        <View style={styles.composerWrap}>
          {safetyMessage ? (
            <Text accessibilityRole="alert" style={styles.safetyMessage}>
              {safetyMessage}
            </Text>
          ) : null}
          {sendError ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {sendError}
            </Text>
          ) : null}
          <View style={styles.composer}>
            <TextInput
              accessibilityLabel={t("chat.accessibility.writeMessage")}
              editable={!sendMutation.isPending && !isConversationBlocked}
              maxLength={MESSAGE_MAX_LENGTH}
              multiline
              onChangeText={(value) => {
                setDraft(value);
                setSendError(null);
              }}
              placeholder={
                isConversationBlocked
                  ? t("chat.composer.blockedPlaceholder")
                  : t("chat.composer.placeholder")
              }
              placeholderTextColor={colors.muted}
              style={styles.composerInput}
              value={draft}
            />
            <Pressable
              accessibilityLabel={t("chat.accessibility.sendMessage")}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSend }}
              disabled={!canSend}
              hitSlop={8}
              onPress={sendMessage}
              style={[
                styles.sendButton,
                !canSend ? styles.sendButtonDisabled : null,
              ]}
            >
              <Ionicons
                color={colors.onAccent}
                name={sendMutation.isPending ? "hourglass-outline" : "send"}
                size={22}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function useProviderQuery({
  accessToken,
  enabled = true,
  providerId,
  userId,
}: {
  accessToken: string | null;
  enabled?: boolean;
  providerId: string;
  userId?: string;
}) {
  return useQuery<ProviderResponse>({
    enabled: Boolean(enabled && accessToken && providerId),
    queryKey: ["provider", userId, providerId],
    queryFn: () => getProvider(accessToken, providerId),
    retry: 1,
  });
}

function formatChatTime(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

function formatProviderFallback(providerId: string): string {
  return `${t("chat.providerFallback")} ${providerId.slice(0, 8)}...`;
}

function isTutorConversationView(conversation: ConversationResponse): boolean {
  return conversation.viewerIsProvider === false;
}

function getCounterpartName(
  conversation: ConversationResponse,
  provider?: ProviderResponse,
): string {
  if (conversation.counterpartName) return conversation.counterpartName;
  if (isTutorConversationView(conversation)) {
    return provider?.name ?? formatProviderFallback(conversation.providerId);
  }
  return t("chat.tutorFallback");
}

function getCounterpartService(
  conversation: ConversationResponse,
  provider?: ProviderResponse,
): string {
  if (conversation.counterpartService) return conversation.counterpartService;
  if (isTutorConversationView(conversation)) {
    return provider?.service ?? t("chat.serviceFallback");
  }
  return t("chat.tutorServiceFallback");
}

function getCounterpartAvatarUri(
  conversation: ConversationResponse,
  provider?: ProviderResponse,
): string | undefined {
  if (conversation.counterpartAvatarUrl)
    return conversation.counterpartAvatarUrl;
  return isTutorConversationView(conversation)
    ? (provider?.avatarUrl ?? undefined)
    : undefined;
}

function getConversationListErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError && error.status === 401) {
    return t("chat.conversations.error.auth");
  }

  return t("chat.conversations.error.generic");
}

function getMessagesErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (error.status === 401) return t("chat.messages.error.auth");
    if (error.status === 404) return t("chat.messages.error.notFound");
  }

  return t("chat.messages.error.generic");
}

function getSendMessageErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (error.status === 400) {
      return t("chat.send.error.validation");
    }
    if (error.status === 401) return t("chat.send.error.auth");
    if (error.status === 404) return t("chat.send.error.notFound");
    if (error.status === 403) return t("chat.send.error.blocked");
  }

  return t("chat.send.error.generic");
}

function getReportErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (error.status === 400) return t("chat.report.error.validation");
    if (error.status === 401) return t("chat.report.error.auth");
    if (error.status === 404) return t("chat.report.error.notFound");
  }

  return t("chat.report.error.generic");
}

function getBlockErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (error.status === 401) return t("chat.block.error.auth");
    if (error.status === 404) return t("chat.block.error.notFound");
  }

  return t("chat.block.error.generic");
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: "800",
  },
  list: {
    gap: spacing[3],
  },
  threadSafe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  threadFlex: {
    flex: 1,
  },
  threadHeader: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  threadHeaderText: {
    flex: 1,
  },
  threadActions: {
    flexDirection: "row",
    gap: spacing[2],
  },
  headerIconButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  headerIconButtonDisabled: {
    opacity: 0.45,
  },
  threadName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  threadService: {
    color: colors.muted,
    fontSize: typography.caption,
  },
  thread: {
    flexGrow: 1,
    gap: spacing[3],
    padding: spacing[4],
  },
  safetyPanel: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  safetyTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
  },
  safetyCopy: {
    color: colors.muted,
    fontSize: typography.small,
    lineHeight: 20,
  },
  safetyRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  categoryButton: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  categoryButtonText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: "700",
  },
  secondarySafetyButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
  },
  secondarySafetyText: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: "800",
  },
  dangerSafetyButton: {
    alignItems: "center",
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    flex: 1,
    minHeight: 42,
    justifyContent: "center",
  },
  dangerSafetyText: {
    color: colors.onAccent,
    fontSize: typography.small,
    fontWeight: "800",
  },
  composerWrap: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing[2],
    padding: spacing[3],
  },
  composer: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing[2],
  },
  composerInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    maxHeight: 112,
    minHeight: 44,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  sendButtonDisabled: {
    opacity: 0.45,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 20,
  },
  safetyMessage: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: "700",
    lineHeight: 20,
  },
});
