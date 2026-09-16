import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  BODY_DARK,
  GREY_400,
  GREY_500,
  GREY_600,
  MUTED,
  THEME_COLOR,
  timeAgo,
  withAlpha,
} from '../../pages/theme';
import { NotificationItem } from '../../pages/mock';
import Dropdown from '../Dropdown';

type AdminNotificationsPageProps = {
  notifications: NotificationItem[];
  onPublish: (item: { title: string; message: string; type: string; priority: string }) => void;
  onDelete: (id: string) => void;
};

const PAGE_BG = '#F4F7F5';

const TYPE_OPTIONS = [
  { label: 'General', value: 'general' },
  { label: 'Session', value: 'session' },
  { label: 'Conference', value: 'conference' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'Announcement', value: 'announcement' },
];

const PRIORITY_OPTIONS = [
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
];

export default function AdminNotificationsPage({
  notifications,
  onPublish,
  onDelete,
}: AdminNotificationsPageProps) {
  const [type, setType] = useState('general');
  const [priority, setPriority] = useState('normal');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(''), 2000);
  }

  function handlePublish() {
    if (title.trim().length === 0) {
      setError('Title is required');
      return;
    }
    if (message.trim().length === 0) {
      setError('Message is required');
      return;
    }
    setError('');
    setSaving(true);
    setTimeout(() => {
      onPublish({
        title: title.trim(),
        message: message.trim(),
        type,
        priority,
      });
      setTitle('');
      setMessage('');
      setSaving(false);
      showToast('Notification published.');
    }, 500);
  }

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Notifications Management</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={24}
              color={THEME_COLOR}
            />
          </View>
          <Text style={styles.infoText}>
            Compose and publish polished conference notices for both mobile
            and web attendees.
          </Text>
        </View>

        <View style={styles.composer}>
          <Text style={styles.composerTitle}>Compose Notification</Text>
          <View style={styles.dropdownRow}>
            <View style={styles.dropdownHalf}>
              <Dropdown
                label="Type"
                value={type}
                options={TYPE_OPTIONS}
                onPick={setType}
              />
            </View>
            <View style={styles.dropdownHalf}>
              <Dropdown
                label="Priority"
                value={priority}
                options={PRIORITY_OPTIONS}
                onPick={setPriority}
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Title</Text>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons
              name="format-title"
              size={20}
              color={THEME_COLOR}
            />
            <TextInput
              style={styles.input}
              placeholder="Notification title"
              placeholderTextColor={GREY_400}
              value={title}
              onChangeText={(value) => {
                setTitle(value);
                if (error) setError('');
              }}
            />
          </View>

          <Text style={styles.fieldLabel}>Message</Text>
          <View style={styles.inputRow}>
            <MaterialCommunityIcons
              name="message-outline"
              size={20}
              color={THEME_COLOR}
            />
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Write your message"
              placeholderTextColor={GREY_400}
              value={message}
              onChangeText={(value) => {
                setMessage(value);
                if (error) setError('');
              }}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {error.length > 0 && <Text style={styles.error}>{error}</Text>}

          <Pressable
            accessibilityRole="button"
            onPress={handlePublish}
            disabled={saving}
            style={({ pressed }) => [
              styles.publishButton,
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
            <Text style={styles.publishLabel}>
              {saving ? 'Publishing...' : 'Publish Notification'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.historyTitle}>Published Notifications</Text>
        {notifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="bell-off-outline"
                size={26}
                color={THEME_COLOR}
              />
            </View>
            <View style={styles.emptyText}>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                Published notifications will appear here with their type and
                priority.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.historyList}>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.historyCard}>
                <View
                  style={styles.historyAvatar}
                >
                  <MaterialCommunityIcons
                    name={
                      notification.priority === 'high'
                        ? 'flag'
                        : 'bell-outline'
                    }
                    size={22}
                    color={THEME_COLOR}
                  />
                </View>
                <View style={styles.historyBody}>
                  <Text style={styles.historyTitleText}>
                    {notification.title}
                  </Text>
                  <Text style={styles.historyMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.historyMeta}>
                    {notification.type.toUpperCase()} •{' '}
                    {(notification.priority || 'normal').toUpperCase()} •{' '}
                    {timeAgo(notification.createdAt)}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Delete notification"
                  onPress={() => onDelete(notification.id)}
                  hitSlop={8}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={22}
                    color={GREY_500}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      {toast.length > 0 && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  container: {
    padding: 16,
    paddingBottom: 28,
  },
  pressed: {
    opacity: 0.75,
  },
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME_COLOR,
  },
  infoCard: {
    marginTop: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: withAlpha(THEME_COLOR, '14'),
    borderRadius: 20,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: withAlpha(THEME_COLOR, '29'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  composer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  composerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: BODY_DARK,
  },
  dropdownRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  dropdownHalf: {
    flex: 1,
  },
  fieldLabel: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  inputRow: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 18,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000000',
  },
  messageInput: {
    minHeight: 76,
  },
  error: {
    marginTop: 10,
    fontSize: 13,
    color: '#DC2626',
  },
  publishButton: {
    marginTop: 16,
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME_COLOR,
    borderRadius: 16,
    elevation: 3,
    shadowColor: THEME_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  publishLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyTitle: {
    marginTop: 18,
    fontSize: 19,
    fontWeight: '800',
    color: BODY_DARK,
  },
  emptyCard: {
    marginTop: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    flex: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BODY_DARK,
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: GREY_600,
    lineHeight: 18,
  },
  historyList: {
    marginTop: 10,
    gap: 10,
  },
  historyCard: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  historyAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: withAlpha(THEME_COLOR, '1F'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyBody: {
    flex: 1,
  },
  historyTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: BODY_DARK,
  },
  historyMessage: {
    marginTop: 4,
    fontSize: 14,
    color: BODY_DARK,
    lineHeight: 20,
  },
  historyMeta: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
  },
  toast: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#323232',
    borderRadius: 20,
  },
  toastText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
