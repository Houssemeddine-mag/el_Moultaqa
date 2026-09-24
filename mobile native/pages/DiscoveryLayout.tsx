import { useState } from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { BODY_DARK, MUTED, TAB_UNSELECTED, THEME_COLOR } from './theme';

// Landing site builder — organizers create and publish conferences here.
// Point this at the local dev server (e.g. http://localhost:5173/builder)
// when testing against a local Landing.
const LANDING_BUILDER_URL = 'https://elmoultaqa.com/builder';
import DiscoveryPage, { ConferenceCard, DiscoveryEvent } from './DiscoveryPage';
import DiscoveryAlertsView from './DiscoveryAlertsView';
import SettingsPage from './SettingsPage';
import type { AlertItem } from './discovery/types';

type DiscoveryLayoutProps = {
  savedSlugs?: string[];
  onToggleSave?: (orgSlug: string) => void;
  myConferences?: DiscoveryEvent[];
  onSelect?: (event: DiscoveryEvent) => void;
  onLogout?: () => void;
  notice?: string;
  alerts?: AlertItem[];
  alertsLoading?: boolean;
  alertsError?: string;
  alertsFailed?: string[];
  unreadAlerts?: number;
  lastAlertsSeen?: number;
  onRefreshAlerts?: () => void;
  onAlertsOpened?: () => void;
  onOpenConference?: (orgSlug: string) => void;
};

// Discovery hub tabs: 0 Discover, 1 Saved, 2 My Events, 3 Alerts, 4 Settings.
const TABS = [
  { icon: 'compass', outline: 'compass-outline', label: 'Discover' },
  { icon: 'bookmark', outline: 'bookmark-outline', label: 'Saved' },
  { icon: 'ticket', outline: 'ticket-outline', label: 'My Events' },
  { icon: 'bell', outline: 'bell-outline', label: 'Alerts' },
  { icon: 'cog', outline: 'cog-outline', label: 'Settings' },
] as const;

function MyConferencesView({
  conferences,
  savedSlugs,
  onToggleSave,
  onSelect,
}: {
  conferences: DiscoveryEvent[];
  savedSlugs: string[];
  onToggleSave?: (orgSlug: string) => void;
  onSelect?: (event: DiscoveryEvent) => void;
}) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <FlatList
        data={conferences}
        keyExtractor={(item) => item.org_slug}
        ListHeaderComponent={
          <View>
            <View style={styles.myHeader}>
              <Text style={styles.myTitle}>My Conferences</Text>
              <Text style={styles.mySub}>
                {conferences.length === 0
                  ? 'Conferences you enter will appear here'
                  : `${conferences.length} entered conference${conferences.length === 1 ? '' : 's'} — tap to re-enter`}
              </Text>
            </View>
            <LinearGradient
              colors={[THEME_COLOR, '#1FB69A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.createCard}
            >
              <View style={styles.createTextWrap}>
                <Text style={styles.createTitle}>Organizing something?</Text>
                <Text style={styles.createSub}>
                  Create your conference on ElMoultaqa and publish it to
                  discovery.
                </Text>
              </View>
              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Start your conference"
                onPress={() => Linking.openURL(LANDING_BUILDER_URL)}
                style={({ pressed }) => [
                  styles.createButton,
                  pressed && styles.createPressed,
                ]}
              >
                <Text style={styles.createButtonLabel}>
                  Start your conference
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={16}
                  color={THEME_COLOR}
                />
              </Pressable>
            </LinearGradient>
          </View>
        }
        renderItem={({ item }) => (
          <ConferenceCard
            event={item}
            onPress={() => onSelect?.(item)}
            saved={savedSlugs.includes(item.org_slug)}
            onToggleSave={
              onToggleSave ? () => onToggleSave(item.org_slug) : undefined
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons
              name="ticket-outline"
              size={36}
              color={THEME_COLOR}
            />
            <Text style={styles.emptyTitle}>No conferences yet</Text>
            <Text style={styles.emptySub}>
              Discover a conference and tap it to enter — it will be kept
              here for quick access.
            </Text>
          </View>
        }
        contentContainerStyle={styles.myListContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default function DiscoveryLayout({
  savedSlugs = [],
  onToggleSave,
  myConferences = [],
  onSelect,
  onLogout,
  notice,
  alerts = [],
  alertsLoading = false,
  alertsError = '',
  alertsFailed = [],
  unreadAlerts = 0,
  lastAlertsSeen = 0,
  onRefreshAlerts,
  onAlertsOpened,
  onOpenConference,
}: DiscoveryLayoutProps) {
  const [tab, setTab] = useState(0);

  const badges = [
    0,
    savedSlugs.length,
    myConferences.length,
    unreadAlerts,
    0,
  ];

  function selectTab(index: number) {
    setTab(index);
    if (index === 3) onAlertsOpened?.();
  }

  return (
    <View style={styles.safe}>
      <View style={styles.body}>
        {tab === 0 && (
          <DiscoveryPage
            onSelect={onSelect}
            notice={notice}
            savedSlugs={savedSlugs}
            onToggleSave={onToggleSave}
          />
        )}
        {tab === 1 && (
          <DiscoveryPage
            savedOnly
            onSelect={onSelect}
            notice={notice}
            savedSlugs={savedSlugs}
            onToggleSave={onToggleSave}
          />
        )}
        {tab === 2 && (
          <MyConferencesView
            conferences={myConferences}
            savedSlugs={savedSlugs}
            onToggleSave={onToggleSave}
            onSelect={onSelect}
          />
        )}
        {tab === 3 && (
          <DiscoveryAlertsView
            hasConferences={myConferences.length > 0}
            items={alerts}
            loading={alertsLoading}
            error={alertsError}
            failedOrgs={alertsFailed}
            lastSeen={lastAlertsSeen}
            onRefresh={onRefreshAlerts}
            onOpenConference={onOpenConference}
          />
        )}
        {tab === 4 && (
          <SafeAreaView
            style={styles.settingsSafe}
            edges={['top', 'bottom']}
          >
            <SettingsPage onLogout={onLogout} />
          </SafeAreaView>
        )}
      </View>

      <View style={styles.tabbar}>
        {TABS.map((item, index) => {
          const selected = tab === index;
          const badge = badges[index] ?? 0;
          return (
            <Pressable
              key={item.label}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              onPress={() => selectTab(index)}
              hitSlop={6}
              style={styles.tabItem}
            >
              <View style={styles.tabIconWrap}>
                <MaterialCommunityIcons
                  name={(selected ? item.icon : item.outline) as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
                  size={25}
                  color={selected ? THEME_COLOR : TAB_UNSELECTED}
                />
                {badge > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeLabel}>
                      {badge > 9 ? '9+' : String(badge)}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[styles.tabLabel, selected && styles.tabLabelSelected]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },
  body: {
    flex: 1,
  },
  settingsSafe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabbar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabIconWrap: {
    position: 'relative',
  },
  tabBadge: {
    position: 'absolute',
    top: -5,
    right: -11,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: TAB_UNSELECTED,
  },
  tabLabelSelected: {
    fontWeight: '700',
    color: THEME_COLOR,
  },
  myListContent: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  createCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    padding: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: THEME_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  createTextWrap: {
    paddingRight: 8,
  },
  createTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  createSub: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 19,
  },
  createButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  createPressed: {
    opacity: 0.8,
  },
  createButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  myHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  myTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: BODY_DARK,
  },
  mySub: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: BODY_DARK,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: MUTED,
    textAlign: 'center',
  },
});
