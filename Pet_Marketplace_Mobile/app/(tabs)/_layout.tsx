import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { CenterTabButton } from '../../src/components/CenterTabButton';
import { LoadingState } from '../../src/components/LoadingState';
import { Screen } from '../../src/components/Screen';
import { useAuth } from '../../src/auth/AuthProvider';
import { colors } from '../../src/design/tokens';
import { t } from '../../src/i18n';

type TabIconName = ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: TabIconName) {
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <Ionicons color={String(color)} name={name} size={size} />;
  }

  TabIcon.displayName = `TabIcon(${name})`;

  return TabIcon;
}

export default function TabsLayout() {
  const { isInitialising, session } = useAuth();

  if (isInitialising) {
    return (
      <Screen>
        <LoadingState label={t('session.loading')} />
      </Screen>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: tabIcon('home-outline'),
          tabBarLabel: t('tabs.home'),
          title: t('tabs.home'),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: tabIcon('search-outline'),
          tabBarLabel: t('tabs.search'),
          title: t('tabs.search'),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: t('tabs.book'),
          tabBarLabel: () => null,
          tabBarButton: (props) => <CenterTabButton onPress={props.onPress} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: tabIcon('chatbubble-ellipses-outline'),
          tabBarLabel: t('tabs.chat'),
          title: t('tabs.chat'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: tabIcon('person-outline'),
          tabBarLabel: t('tabs.profile'),
          title: t('tabs.profile'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{ href: null, title: t('tabs.settings') }}
      />
    </Tabs>
  );
}
