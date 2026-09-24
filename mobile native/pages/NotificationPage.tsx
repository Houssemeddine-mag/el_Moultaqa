import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  GREY_600,
  INBOX_BG,
  THEME_COLOR,
  timeAgo,
  withAlpha,
} from './theme';
import { MOCK_NOTIFICATIONS, NotificationItem } from './mock';
import SupabaseService from '../services/supabase';

export default function NotificationPage() {
  // Live announcements for the current conference; falls back to the
  // bundled preview when the backend is unreachable (e.g. no auth yet).
  const [items, setItems] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await SupabaseService.getNotifications();
        if (!active || rows.length === 0) return;
        setItems(
          rows.map((row, index) => {
            const raw = row['created_at'];
            const parsed =
              typeof raw === 'number' ? raw : Date.parse(String(raw ?? ''));
            return {
              id: String(row['id'] ?? `live-${index}`),
              title: String(row['title'] ?? 'Update'),
              message: String(row['content'] ?? row['message'] ?? ''),
              type: String(row['type'] ?? 'info'),
              createdAt: Number.isNaN(parsed) ? Date.now() : parsed,
            };
          }),
        );
        setLive(true);
      } catch {
        // Offline preview stays in place.
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.safe}>
      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Latest updates</Text>
          <View
            style={[
              styles.sourceBadge,
              live ? styles.sourceLive : styles.sourcePreview,
            ]}
          >
            <Text
              style={[
                styles.sourceLabel,
                live ? styles.sourceLabelLive : styles.sourceLabelPreview,
              ]}
            >
              {live ? 'Live' : 'Preview'}
            </Text>
          </View>
        </View>
        {items.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No notifications published yet.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {items.map((notification) => (
              <View key={notification.id} style={styles.card}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={24}
                    color={THEME_COLOR}
                  />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{notification.title}</Text>
                  <Text style={styles.cardMessage}>{notification.message}</Text>
                  <Text style={styles.cardMeta}>
                    {notification.type.toUpperCase()} •{' '}
                    {timeAgo(notification.createdAt)}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: INBOX_BG,
  },
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  sourceLive: {
    backgroundColor: '#E8F5E9',
  },
  sourcePreview: {
    backgroundColor: '#F3F4F6',
  },
  sourceLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  sourceLabelLive: {
    color: '#2E7D32',
  },
  sourceLabelPreview: {
    color: GREY_600,
  },
  list: {
    marginTop: 12,
    gap: 12,
    paddingBottom: 12,
  },
  card: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: withAlpha(THEME_COLOR, '1F'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardMessage: {
    paddingTop: 8,
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
  cardMeta: {
    paddingTop: 8,
    fontSize: 12,
    color: GREY_600,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: GREY_600,
  },
});
