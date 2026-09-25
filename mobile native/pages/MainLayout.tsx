import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { THEME_COLOR } from './theme';
import SupabaseService from '../services/supabase';
import { MOCK_CONFERENCE, MOCK_NOTIFICATIONS, StreamItem } from './mock';
import AppDrawer from './AppDrawer';
import HomePage from './HomePage';
import ProgramPage from './ProgramPage';
import LivePage from './LivePage';
import StreamPlayerPage from './StreamPlayerPage';
import NotificationPage from './NotificationPage';
import KeynoteSpeakersPage from './KeynoteSpeakersPage';
import PresentationFeedbackPage from './PresentationFeedbackPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';

type Pushed =
  | { type: 'keynotes' }
  | { type: 'stream'; stream: StreamItem }
  | { type: 'notifications' }
  | { type: 'feedback'; title: string };

type MainLayoutProps = {
  userRole?: string;
  onLogout?: () => void;
  onBrowse?: () => void;
};

function pushedTitle(pushed: Pushed) {
  switch (pushed.type) {
    case 'keynotes':
      return 'Keynote Speakers';
    case 'stream':
      return pushed.stream.name;
    case 'notifications':
      return 'Notifications';
    case 'feedback':
      return pushed.title || 'Feedback';
  }
}

export default function MainLayout({
  userRole = 'user',
  onLogout,
  onBrowse,
}: MainLayoutProps) {
  const [tab, setTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pushed, setPushed] = useState<Pushed | null>(null);
  const [unread, setUnread] = useState(MOCK_NOTIFICATIONS.length);

  // Same business logic as webapp: badge reflects real notification count.
  // Falls back to mock count when offline / pre-auth (UI unchanged).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await SupabaseService.fetchNotifications(20);
        if (!active || rows.length === 0) return;
        setUnread(rows.length);
      } catch {
        // keep mock fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Org name resolved at boot (anon-safe); falls back to mock branding.
  const orgName =
    SupabaseService.orgDetails?.['name'] ?? MOCK_CONFERENCE.name;

  const isStreamPushed = pushed?.type === 'stream';

  function selectTab(index: number) {
    setTab(index);
    setPushed(null);
    setDrawerOpen(false);
  }

  function push(next: Pushed) {
    if (next.type === 'notifications') setUnread(0);
    setPushed(next);
  }

  function pop() {
    setPushed(null);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {!isStreamPushed && (
        <View style={styles.appbar}>
          {pushed ? (
            <Pressable
              accessibilityRole="button"
              onPress={pop}
              hitSlop={12}
              style={styles.appbarIcon}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={THEME_COLOR}
              />
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              onPress={() => setDrawerOpen(true)}
              hitSlop={12}
              style={styles.appbarIcon}
            >
              <MaterialCommunityIcons
                name="menu"
                size={24}
                color={THEME_COLOR}
              />
            </Pressable>
          )}
          <Text style={styles.appbarTitle} numberOfLines={1}>
            {pushed ? pushedTitle(pushed) : orgName}
          </Text>
          {pushed ? (
            <View style={styles.appbarIcon} />
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => push({ type: 'notifications' })}
              hitSlop={12}
              style={styles.appbarIcon}
            >
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color={THEME_COLOR}
              />
              {unread > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unread > 9 ? '9+' : String(unread)}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.body}>
        {pushed?.type === 'keynotes' && <KeynoteSpeakersPage />}
        {pushed?.type === 'stream' && (
          <StreamPlayerPage stream={pushed.stream} onBack={pop} />
        )}
        {pushed?.type === 'notifications' && <NotificationPage />}
        {pushed?.type === 'feedback' && (
          <PresentationFeedbackPage title={pushed.title} onClose={pop} />
        )}
        {!pushed && tab === 0 && (
          <HomePage
            onNavigateToProgram={() => selectTab(1)}
            onNavigateToKeynotes={() => push({ type: 'keynotes' })}
          />
        )}
        {!pushed && tab === 1 && (
          <ProgramPage
            onFeedback={(title) => push({ type: 'feedback', title })}
          />
        )}
        {!pushed && tab === 2 && (
          <LivePage onOpenStream={(stream) => push({ type: 'stream', stream })} />
        )}
        {!pushed && tab === 3 && <ProfilePage />}
        {!pushed && tab === 4 && <SettingsPage onLogout={onLogout} />}
      </View>

      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={styles.drawerBackdrop}>
          <View style={styles.drawerPanel}>
            <AppDrawer
              selectedIndex={tab}
              conferenceName={orgName}
              onSelect={selectTab}
              onBrowse={onBrowse}
            />
          </View>
          <Pressable
            style={styles.drawerDismiss}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  appbarIcon: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appbarTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLOR,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  body: {
    flex: 1,
  },
  drawerBackdrop: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerDismiss: {
    flex: 1,
  },
  drawerPanel: {
    width: 300,
    maxWidth: '85%',
    height: '100%',
    backgroundColor: '#FDFDFD',
  },
});
