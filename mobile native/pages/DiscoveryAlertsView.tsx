import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  BODY_DARK,
  GREY_600,
  MUTED,
  THEME_COLOR,
  timeAgo,
  withAlpha,
} from './theme';
import type { AlertItem } from './discovery/types';

type DiscoveryAlertsViewProps = {
  hasConferences: boolean;
  items: AlertItem[];
  loading: boolean;
  error?: string;
  failedOrgs?: string[];
  lastSeen?: number;
  onRefresh?: () => void;
  onOpenConference?: (orgSlug: string) => void;
};

function AlertCard({
  item,
  unread,
  onOpen,
}: {
  item: AlertItem;
  unread: boolean;
  onOpen?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.unreadBar, unread && styles.unreadBarOn]} />
      <View style={styles.iconBox}>
        <MaterialCommunityIcons
          name="bell-outline"
          size={22}
          color={THEME_COLOR}
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardOrg} numberOfLines={1}>
          {item.org_name || 'Conference'}
        </Text>
        <Text
          style={[styles.cardTitle, unread && styles.cardTitleUnread]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        {item.body ? (
          <Text style={styles.cardMessage} numberOfLines={3}>
            {item.body}
          </Text>
        ) : null}
        <Text style={styles.cardMeta}>
          {item.createdAt > 0 ? timeAgo(item.createdAt) : 'Recently'}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={18}
        color={MUTED}
      />
    </Pressable>
  );
}

export default function DiscoveryAlertsView({
  hasConferences,
  items,
  loading,
  error,
  failedOrgs = [],
  lastSeen = 0,
  onRefresh,
  onOpenConference,
}: DiscoveryAlertsViewProps) {
  if (loading && items.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={THEME_COLOR} />
          <Text style={styles.centerText}>Checking for updates…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertCard
            item={item}
            unread={item.createdAt > lastSeen}
            onOpen={
              onOpenConference
                ? () => onOpenConference(item.org_slug)
                : undefined
            }
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Updates</Text>
            <Text style={styles.sub}>
              {hasConferences
                ? items.length === 0
                  ? 'Latest announcements from your conferences'
                  : `${items.length} update${items.length === 1 ? '' : 's'} from your conferences`
                : 'Announcements from your conferences will appear here'}
            </Text>
            {failedOrgs.length > 0 && (
              <View style={styles.warnBox}>
                <MaterialCommunityIcons
                  name="wifi-off"
                  size={14}
                  color="#B7791F"
                />
                <Text style={styles.warnText} numberOfLines={2}>
                  {failedOrgs.length === 1
                    ? `${failedOrgs[0]} is unreachable right now`
                    : `${failedOrgs.length} conferences unreachable right now`}
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.centerBox}>
            {error ? (
              <>
                <MaterialCommunityIcons
                  name="wifi-off"
                  size={32}
                  color={THEME_COLOR}
                />
                <Text style={styles.emptyTitle}>Couldn't load updates</Text>
                <Text style={styles.emptySub}>{error}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={onRefresh}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryLabel}>Retry</Text>
                </Pressable>
              </>
            ) : !hasConferences ? (
              <>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={32}
                  color={THEME_COLOR}
                />
                <Text style={styles.emptyTitle}>No conferences yet</Text>
                <Text style={styles.emptySub}>
                  Enter a conference and you'll get its announcements here.
                </Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name="bell-check-outline"
                  size={32}
                  color={THEME_COLOR}
                />
                <Text style={styles.emptyTitle}>You're all caught up</Text>
                <Text style={styles.emptySub}>
                  No announcements from your conferences yet.
                </Text>
              </>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={THEME_COLOR}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  pressed: {
    opacity: 0.75,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: BODY_DARK,
    letterSpacing: -0.3,
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  warnBox: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#F0E0B6',
    borderRadius: 10,
  },
  warnText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#8A6D1B',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F1F4',
    borderRadius: 16,
    overflow: 'hidden',
  },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'transparent',
  },
  unreadBarOn: {
    backgroundColor: THEME_COLOR,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
  },
  cardOrg: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME_COLOR,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: BODY_DARK,
    lineHeight: 19,
  },
  cardTitleUnread: {
    fontWeight: '800',
  },
  cardMessage: {
    marginTop: 3,
    fontSize: 13,
    color: GREY_600,
    lineHeight: 18,
  },
  cardMeta: {
    marginTop: 5,
    fontSize: 11,
    color: MUTED,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 8,
  },
  centerText: {
    fontSize: 13,
    color: MUTED,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BODY_DARK,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: MUTED,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: THEME_COLOR,
    borderRadius: 10,
  },
  retryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
