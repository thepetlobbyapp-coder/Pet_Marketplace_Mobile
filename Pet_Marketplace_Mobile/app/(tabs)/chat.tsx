import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../src/components/Avatar';
import { ConversationRow } from '../../src/components/ConversationRow';
import { IconButton } from '../../src/components/IconButton';
import { MessageBubble } from '../../src/components/MessageBubble';
import { Screen } from '../../src/components/Screen';
import {
  demoConversations,
  demoProviders,
  type DemoConversationMessage,
} from '../../src/data/demoFixtures';
import { colors, radius, spacing, typography } from '../../src/design/tokens';

// DEMO SEED: conversations come from local fixtures. Sent messages are kept
// in local state only — the chat backend does not exist yet.
export default function ChatScreen() {
  const [openId, setOpenId] = useState<string | null>(null);
  // Conversations marked as read once the tutor has opened them.
  const [readIds, setReadIds] = useState<string[]>([]);

  function openConversation(conversationId: string) {
    setOpenId(conversationId);
    setReadIds((current) =>
      current.includes(conversationId) ? current : [...current, conversationId],
    );
  }

  if (openId) {
    return (
      <ChatThread conversationId={openId} onBack={() => setOpenId(null)} />
    );
  }

  return (
    <Screen variant="top">
      <Text style={styles.title}>Mensagens</Text>
      <View style={styles.list}>
        {demoConversations.map((conversation) => {
          const provider = demoProviders.find(
            (item) => item.id === conversation.providerId,
          );
          return (
            <ConversationRow
              avatarUri={provider?.avatarUri}
              key={conversation.id}
              lastMessage={conversation.lastMessage}
              name={provider?.name ?? 'Prestador'}
              onPress={() => openConversation(conversation.id)}
              service={provider?.service ?? ''}
              time={conversation.lastTime}
              unread={
                readIds.includes(conversation.id) ? 0 : conversation.unread
              }
            />
          );
        })}
      </View>
    </Screen>
  );
}

function ChatThread({
  conversationId,
  onBack,
}: {
  conversationId: string;
  onBack: () => void;
}) {
  const conversation = useMemo(
    () => demoConversations.find((item) => item.id === conversationId),
    [conversationId],
  );
  const provider = useMemo(
    () => demoProviders.find((item) => item.id === conversation?.providerId),
    [conversation],
  );

  const [messages, setMessages] = useState<DemoConversationMessage[]>(
    conversation?.messages ?? [],
  );
  const [draft, setDraft] = useState('');

  function sendMessage() {
    const text = draft.trim();
    if (text.length === 0) {
      return;
    }
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes(),
    ).padStart(2, '0')}`;
    setMessages((current) => [
      ...current,
      { id: `local-${current.length}`, fromProvider: false, text, time },
    ]);
    setDraft('');
  }

  return (
    <SafeAreaView style={styles.threadSafe}>
      <View style={styles.threadHeader}>
        <Pressable
          accessibilityLabel="Voltar para as conversas"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
        >
          <Ionicons color={colors.text} name="chevron-back" size={26} />
        </Pressable>
        <Avatar
          name={provider?.name ?? 'Prestador'}
          size={40}
          uri={provider?.avatarUri}
        />
        <View style={styles.threadHeaderText}>
          <Text style={styles.threadName}>{provider?.name ?? 'Prestador'}</Text>
          <Text style={styles.threadService}>{provider?.service ?? ''}</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.threadFlex}
      >
        <ScrollView
          contentContainerStyle={styles.thread}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble
              fromProvider={message.fromProvider}
              key={message.id}
              text={message.text}
              time={message.time}
            />
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            accessibilityLabel="Escreva uma mensagem"
            onChangeText={setDraft}
            placeholder="Escreva uma mensagem..."
            placeholderTextColor={colors.muted}
            style={styles.composerInput}
            value={draft}
          />
          <IconButton
            accessibilityLabel="Enviar mensagem"
            icon="send"
            onPress={sendMessage}
            variant="accent"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.display,
    fontWeight: '800',
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
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  threadHeaderText: {
    flex: 1,
  },
  threadName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: '700',
  },
  threadService: {
    color: colors.muted,
    fontSize: typography.caption,
  },
  thread: {
    gap: spacing[3],
    padding: spacing[4],
  },
  composer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing[2],
    padding: spacing[3],
  },
  composerInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    minHeight: 44,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
});
