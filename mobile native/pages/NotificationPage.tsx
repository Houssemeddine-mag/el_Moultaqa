import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  GREY_600,
  INBOX_BG,
  THEME_COLOR,
  timeAgo,
  withAlpha,
} from './theme';
import { MOCK_NOTIFICATIONS } from './mock';

export default function NotificationPage() {
  return (
    <View style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.header}>Latest updates</Text>
        {MOCK_NOTIFICATIONS.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No notifications published yet.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {MOCK_NOTIFICATIONS.map((notification) => (
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
