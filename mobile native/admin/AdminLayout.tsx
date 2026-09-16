import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GREY_600, THEME_COLOR } from '../pages/theme';
import SupabaseService from '../services/supabase';
import {
  MOCK_CONFERENCE,
  MOCK_NOTIFICATIONS,
  MOCK_QUESTIONS,
  NotificationItem,
  Question,
} from '../pages/mock';
import AdminDrawer from './AdminDrawer';
import AdminHomePage from './pages/AdminHomePage';
import AdminProgramPage from './pages/AdminProgramPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage';
import AdminQuestionsPage from './pages/AdminQuestionsPage';

type AdminLayoutProps = {
  onExit?: () => void;
};

export default function AdminLayout({ onExit }: AdminLayoutProps) {
  const [tab, setTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [questions, setQuestions] =
    useState<Question[]>(MOCK_QUESTIONS);

  // Org name resolved at boot (anon-safe); falls back to mock branding.
  const orgName =
    SupabaseService.orgDetails?.['name'] ?? MOCK_CONFERENCE.name;

  function selectTab(index: number) {
    setTab(index);
    setDrawerOpen(false);
  }

  function handlePublish(item: {
    title: string;
    message: string;
    type: string;
    priority: string;
  }) {
    setNotifications((current) => [
      {
        id: `n-${Date.now()}`,
        title: item.title,
        message: item.message,
        type: item.type,
        priority: item.priority,
        createdAt: Date.now(),
      } as NotificationItem,
      ...current,
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.appbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={() => setDrawerOpen(true)}
          hitSlop={12}
          style={styles.appbarIcon}
        >
          <MaterialCommunityIcons name="menu" size={24} color={THEME_COLOR} />
        </Pressable>
        <Text style={styles.appbarTitle} numberOfLines={1}>
          {orgName}
        </Text>
        <View style={styles.appbarIcon} />
      </View>

      <View style={styles.body}>
        {tab === 0 && (
          <AdminHomePage
            notifications={notifications}
            questions={questions}
            onOpenProgram={() => setTab(1)}
            onOpenNotifications={() => setTab(2)}
            onOpenQuestions={() => setTab(3)}
          />
        )}
        {tab === 1 && <AdminProgramPage />}
        {tab === 2 && (
          <AdminNotificationsPage
            notifications={notifications}
            onPublish={handlePublish}
            onDelete={(id) =>
              setNotifications((current) =>
                current.filter((item) => item.id !== id),
              )
            }
          />
        )}
        {tab === 3 && (
          <AdminQuestionsPage
            questions={questions}
            onAnswer={(id, answer) =>
              setQuestions((current) =>
                current.map((item) =>
                  item.id === id ? { ...item, answer } : item,
                ),
              )
            }
            onDelete={(id) =>
              setQuestions((current) =>
                current.filter((item) => item.id !== id),
              )
            }
          />
        )}
      </View>

      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={styles.drawerBackdrop}>
          <View style={styles.drawerPanel}>
            <AdminDrawer
              selectedIndex={tab}
              onSelect={selectTab}
              onExit={() => {
                setDrawerOpen(false);
                setConfirmExit(true);
              }}
            />
          </View>
          <Pressable
            style={styles.drawerDismiss}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      </Modal>

      <Modal
        visible={confirmExit}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmExit(false)}
      >
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialog}>
            <View style={styles.dialogTitleRow}>
              <MaterialCommunityIcons
                name="logout"
                size={28}
                color={THEME_COLOR}
              />
              <Text style={styles.dialogTitle}>Leave admin panel</Text>
            </View>
            <Text style={styles.dialogBody}>
              Do you want to exit the admin panel?
            </Text>
            <View style={styles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setConfirmExit(false)}
              >
                <Text style={styles.dialogCancel}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setConfirmExit(false);
                  onExit?.();
                }}
                style={styles.dialogExit}
              >
                <Text style={styles.dialogExitLabel}>Exit</Text>
              </Pressable>
            </View>
          </View>
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
    width: 260,
    maxWidth: '85%',
    height: '100%',
    backgroundColor: '#FDFDFD',
  },
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    padding: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  dialogTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  dialogBody: {
    marginTop: 12,
    fontSize: 16,
    color: '#000000',
  },
  dialogActions: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
  },
  dialogCancel: {
    fontSize: 15,
    color: GREY_600,
  },
  dialogExit: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: THEME_COLOR,
    borderRadius: 8,
  },
  dialogExitLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
