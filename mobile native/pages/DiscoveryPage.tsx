import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import {
  BODY_DARK,
  GREY_600,
  LIVE_RED,
  MUTED,
  THEME_COLOR,
  withAlpha,
} from './theme';
import SupabaseService from '../services/supabase';
import type { DiscoveryEvent } from './discovery/types';
import {
  categoryGradient,
  categoryIcon,
  eventKey,
  formatCategory,
  formatShortDate,
  statusOf,
  toDiscoveryEvent,
} from './discovery/utils';

export type { DiscoveryEvent } from './discovery/types';

type DiscoveryPageProps = {
  onSelect?: (event: DiscoveryEvent) => void;
  notice?: string;
  savedSlugs?: string[];
  onToggleSave?: (orgSlug: string) => void;
  savedOnly?: boolean;
};

const brandLogo = require('../assets/images/logo.png');

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function Thumb({ event, size }: { event: DiscoveryEvent; size: number }) {
  if (event.logo_url) {
    return (
      <Image
        source={{ uri: event.logo_url }}
        style={{ width: size, height: size, borderRadius: 12 }}
        resizeMode="cover"
      />
    );
  }
  const [from, to] = categoryGradient(event.category);
  return (
    <LinearGradient
      colors={[from, to]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.42, fontWeight: '800', color: '#FFFFFF' }}>
        {(event.title || 'C').slice(0, 1).toUpperCase()}
      </Text>
    </LinearGradient>
  );
}

function SaveButton({
  event,
  saved,
  onToggleSave,
}: {
  event: DiscoveryEvent;
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  if (!onToggleSave) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark'}
      onPress={onToggleSave}
      hitSlop={10}
      style={styles.saveButton}
    >
      <MaterialCommunityIcons
        name={saved ? 'bookmark' : 'bookmark-outline'}
        size={16}
        color={saved ? THEME_COLOR : GREY_600}
      />
    </Pressable>
  );
}

export function ConferenceCard({
  event,
  onPress,
  saved,
  onToggleSave,
}: {
  event: DiscoveryEvent;
  onPress: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  const status = statusOf(event);
  const dateLabel = event.end_date
    ? `${formatShortDate(event.start_date)} – ${formatShortDate(event.end_date)}`
    : formatShortDate(event.start_date);
  const meta = [dateLabel, event.location].filter(Boolean).join('  ·  ');
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Thumb event={event} size={72} />
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={styles.badgesRow}>
            <View
              style={[
                styles.badge,
                status.type === 'live' && styles.badgeLive,
                status.type === 'upcoming' && styles.badgeUpcoming,
              ]}
            >
              {status.type === 'live' && <View style={styles.liveDotSm} />}
              <Text
                style={[
                  styles.badgeLabel,
                  status.type === 'live' && styles.badgeLabelLive,
                  status.type === 'upcoming' && styles.badgeLabelUpcoming,
                ]}
              >
                {status.label}
              </Text>
            </View>
            {event.is_extra && (
              <View style={[styles.badge, styles.badgeExtra]}>
                <Text style={[styles.badgeLabel, styles.badgeLabelExtra]}>
                  Featured
                </Text>
              </View>
            )}
            {event.pricing === 'free' && (
              <View style={[styles.badge, styles.badgeFree]}>
                <Text style={[styles.badgeLabel, styles.badgeLabelFree]}>
                  Free
                </Text>
              </View>
            )}
          </View>
          <SaveButton event={event} saved={saved} onToggleSave={onToggleSave} />
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.cardOrg} numberOfLines={1}>
          {[event.org_name, formatCategory(event.category)]
            .filter(Boolean)
            .join('  ·  ')}
        </Text>
        {meta ? (
          <Text style={styles.cardMeta} numberOfLines={1}>
            {meta}
          </Text>
        ) : null}
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={18}
        color={MUTED}
        style={styles.cardChevron}
      />
    </Pressable>
  );
}

function SpotlightCard({
  event,
  saved,
  onToggleSave,
  onPress,
}: {
  event: DiscoveryEvent;
  saved?: boolean;
  onToggleSave?: () => void;
  onPress: () => void;
}) {
  const [from, to] = categoryGradient(event.category);
  const dateLabel = event.end_date
    ? `${formatShortDate(event.start_date)} – ${formatShortDate(event.end_date)}`
    : formatShortDate(event.start_date);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.spotlight, pressed && styles.pressed]}
    >
      {event.logo_url ? (
        <Image
          source={{ uri: event.logo_url }}
          style={styles.spotlightCover}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={[from, to]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.spotlightCover, styles.spotlightFallback]}
        >
          <Text style={styles.spotlightLetter}>
            {(event.title || 'C').slice(0, 1).toUpperCase()}
          </Text>
        </LinearGradient>
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.78)']}
        style={styles.spotlightShade}
      />
      <View style={styles.spotlightTop}>
        <View style={styles.spotlightBadges}>
          <View style={styles.spotlightPill}>
            <MaterialCommunityIcons name="star" size={11} color="#FFD54F" />
            <Text style={styles.spotlightPillLabel}>Featured</Text>
          </View>
          {event.pricing === 'free' && (
            <View style={styles.spotlightPill}>
              <Text style={styles.spotlightPillLabel}>Free entry</Text>
            </View>
          )}
        </View>
        {onToggleSave && (
          <Pressable
            accessibilityRole="button"
            onPress={onToggleSave}
            hitSlop={10}
            style={styles.spotlightSave}
          >
            <MaterialCommunityIcons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={17}
              color="#FFFFFF"
            />
          </Pressable>
        )}
      </View>
      <View style={styles.spotlightBottom}>
        <Text style={styles.spotlightCategory}>
          {formatCategory(event.category).toUpperCase()}
        </Text>
        <Text style={styles.spotlightTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.spotlightMetaRow}>
          <View style={styles.spotlightMeta}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={13}
              color="rgba(255,255,255,0.9)"
            />
            <Text style={styles.spotlightMetaText} numberOfLines={1}>
              {dateLabel || 'Date soon'}
            </Text>
          </View>
          {event.location ? (
            <View style={styles.spotlightMeta}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={13}
                color="rgba(255,255,255,0.9)"
              />
              <Text style={styles.spotlightMetaText} numberOfLines={1}>
                {event.location}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function LiveRibbonCard({
  event,
  onPress,
  saved,
  onToggleSave,
}: {
  event: DiscoveryEvent;
  onPress: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.ribbonCard, pressed && styles.pressed]}
    >
      <View>
        <Thumb event={event} size={196} />
        <View style={styles.ribbonLiveBadge}>
          <View style={styles.liveDotSm} />
          <Text style={styles.ribbonLiveLabel}>LIVE</Text>
        </View>
      </View>
      <View style={styles.ribbonBody}>
        <Text style={styles.ribbonTitle} numberOfLines={2}>
          {event.title}
        </Text>
        {event.location ? (
          <Text style={styles.ribbonMeta} numberOfLines={1}>
            {event.location}
          </Text>
        ) : null}
      </View>
      {onToggleSave && (
        <Pressable
          accessibilityRole="button"
          onPress={onToggleSave}
          hitSlop={10}
          style={styles.ribbonSave}
        >
          <MaterialCommunityIcons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={15}
            color={saved ? THEME_COLOR : '#FFFFFF'}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

export default function DiscoveryPage({
  onSelect,
  notice,
  savedSlugs = [],
  onToggleSave,
  savedOnly = false,
}: DiscoveryPageProps) {
  const [events, setEvents] = useState<DiscoveryEvent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setLoadError('');
    try {
      const [rows, cats] = await Promise.all([
        SupabaseService.listDiscoveryEvents(),
        SupabaseService.listDiscoveryCategories().catch(() => [] as string[]),
      ]);
      setEvents(rows.map(toDiscoveryEvent));
      setCategories(cats);
    } catch (e) {
      setLoadError(
        e instanceof Error ? e.message : 'Failed to load conferences.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const liveEvents = useMemo(
    () => events.filter((event) => event.is_ongoing),
    [events],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events
      .filter((event) => savedOnly || !event.is_ongoing)
      .filter((event) => {
        if (savedOnly && !savedSlugs.includes(event.org_slug)) return false;
        if (query) {
          const haystack =
            `${event.title} ${event.org_name} ${formatCategory(event.category)} ${event.location}`.toLowerCase();
          if (!haystack.includes(query)) return false;
        }
        if (activeCategory && event.category !== activeCategory) return false;
        return true;
      });
  }, [events, search, activeCategory, savedOnly, savedSlugs]);

  // Spotlight: featured (or first) upcoming event, shown unfiltered only.
  const spotlight = useMemo(() => {
    if (savedOnly || search.trim() || activeCategory) return null;
    const upcoming = events.filter(
      (event) => !event.is_ongoing && !event.is_completed,
    );
    return (
      upcoming.find((event) => event.is_extra) ?? upcoming[0] ?? null
    );
  }, [events, savedOnly, search, activeCategory]);

  const listEvents = useMemo(() => {
    if (!spotlight) return filtered;
    const key = eventKey(spotlight);
    return filtered.filter((event) => eventKey(event) !== key);
  }, [filtered, spotlight]);

  const stats = useMemo(() => {
    const cats = new Set(events.map((event) => event.category)).size;
    return [
      { value: String(events.length), label: 'Conferences' },
      { value: String(cats), label: 'Categories' },
      { value: String(liveEvents.length), label: 'Live now' },
    ];
  }, [events, liveEvents]);

  function isSaved(event: DiscoveryEvent) {
    return savedSlugs.includes(event.org_slug);
  }

  function renderHeader() {
    return (
      <View>
        <LinearGradient
          colors={[THEME_COLOR, '#1FB69A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroCircleLarge} />
          <View style={styles.heroCircleSmall} />
          <View style={styles.appbar}>
            <Image
              source={brandLogo}
              style={styles.brandLogo}
              resizeMode="contain"
            />
            <Text style={styles.brandName}>ElMoultaqa</Text>
          </View>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.heroTitle}>Find your next conference</Text>
          <View style={styles.searchRow}>
            <MaterialCommunityIcons name="magnify" size={18} color={MUTED} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conferences, topics, places…"
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Clear search"
                onPress={() => setSearch('')}
                hitSlop={10}
              >
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color={MUTED}
                />
              </Pressable>
            )}
          </View>
          {!savedOnly && (
            <View style={styles.statsRow}>
              {stats.map((stat) => (
                <View key={stat.label} style={styles.statPill}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          )}
        </LinearGradient>

        {notice ? (
          <View style={styles.noticeBox}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={15}
              color="#DC2626"
            />
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}

        {spotlight && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured</Text>
            </View>
            <SpotlightCard
              event={spotlight}
              saved={isSaved(spotlight)}
              onToggleSave={
                onToggleSave
                  ? () => onToggleSave(spotlight.org_slug)
                  : undefined
              }
              onPress={() => onSelect?.(spotlight)}
            />
          </View>
        )}

        {!savedOnly && liveEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.liveDot} />
                <Text style={styles.sectionTitle}>Live now</Text>
              </View>
              <Text style={styles.sectionCount}>{liveEvents.length}</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ribbonTrack}
            >
              {liveEvents.map((event) => (
                <LiveRibbonCard
                  key={eventKey(event)}
                  event={event}
                  onPress={() => onSelect?.(event)}
                  saved={isSaved(event)}
                  onToggleSave={
                    onToggleSave ? () => onToggleSave(event.org_slug) : undefined
                  }
                />
              ))}
            </ScrollView>
          </View>
        )}

        {categories.length > 0 && (
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsTrack}
            >
              <Pressable
                accessibilityRole="button"
                onPress={() => setActiveCategory(null)}
                style={[
                  styles.chip,
                  activeCategory === null && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipLabel,
                    activeCategory === null && styles.chipLabelActive,
                  ]}
                >
                  All
                </Text>
              </Pressable>
              {categories.map((category) => {
                const active = activeCategory === category;
                return (
                  <Pressable
                    key={category}
                    accessibilityRole="button"
                    onPress={() => setActiveCategory(active ? null : category)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <MaterialCommunityIcons
                      name={categoryIcon(category) as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
                      size={13}
                      color={active ? '#FFFFFF' : THEME_COLOR}
                    />
                    <Text
                      style={[
                        styles.chipLabel,
                        active && styles.chipLabelActive,
                      ]}
                    >
                      {formatCategory(category)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={[styles.section, styles.listTitleRow]}>
          <Text style={styles.sectionTitle}>
            {savedOnly ? 'Saved' : 'Browse'}
          </Text>
          <Text style={styles.sectionCount}>{listEvents.length}</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={THEME_COLOR} />
          <Text style={styles.centerText}>Loading conferences…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <FlatList
        data={listEvents}
        keyExtractor={(item) => eventKey(item)}
        renderItem={({ item }) => (
          <ConferenceCard
            event={item}
            onPress={() => onSelect?.(item)}
            saved={isSaved(item)}
            onToggleSave={
              onToggleSave ? () => onToggleSave(item.org_slug) : undefined
            }
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.centerBox}>
            {loadError ? (
              <>
                <MaterialCommunityIcons
                  name="wifi-off"
                  size={32}
                  color={THEME_COLOR}
                />
                <Text style={styles.emptyTitle}>Couldn't load conferences</Text>
                <Text style={styles.emptySub}>{loadError}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => load(false)}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryLabel}>Retry</Text>
                </Pressable>
              </>
            ) : savedOnly ? (
              <>
                <MaterialCommunityIcons
                  name="bookmark-outline"
                  size={32}
                  color={THEME_COLOR}
                />
                <Text style={styles.emptyTitle}>Nothing saved yet</Text>
                <Text style={styles.emptySub}>
                  Tap the bookmark on any conference to keep it here.
                </Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons
                  name="magnify"
                  size={32}
                  color={THEME_COLOR}
                />
                <Text style={styles.emptyTitle}>No conferences found</Text>
                <Text style={styles.emptySub}>
                  Try adjusting your search or filters.
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setSearch('');
                    setActiveCategory(null);
                  }}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryLabel}>Clear filters</Text>
                </Pressable>
              </>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
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
  hero: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
  },
  heroCircleLarge: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroCircleSmall: {
    position: 'absolute',
    bottom: -46,
    left: -28,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 46,
    height: 46,
    tintColor: '#FFFFFF',
  },
  brandName: {
    marginLeft: 10,
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  greeting: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  heroTitle: {
    marginTop: 2,
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  searchRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 13,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: BODY_DARK,
  },
  statsRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },
  noticeBox: {
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#DC2626',
  },
  section: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BODY_DARK,
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: MUTED,
  },
  listTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: LIVE_RED,
  },
  liveDotSm: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: LIVE_RED,
  },
  spotlight: {
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
  },
  spotlightCover: {
    width: '100%',
    height: 200,
  },
  spotlightFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightLetter: {
    fontSize: 72,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.9)',
  },
  spotlightShade: {
    ...StyleSheet.absoluteFill,
  },
  spotlightTop: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  spotlightBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  spotlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
  },
  spotlightPillLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  spotlightSave: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightBottom: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
  },
  spotlightCategory: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#FFD54F',
  },
  spotlightTitle: {
    marginTop: 3,
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  spotlightMetaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  spotlightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  spotlightMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
  },
  ribbonTrack: {
    gap: 10,
    paddingRight: 16,
  },
  ribbonCard: {
    width: 196,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F1F4',
    borderRadius: 14,
    overflow: 'hidden',
  },
  ribbonBody: {
    padding: 10,
  },
  ribbonTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BODY_DARK,
    lineHeight: 17,
  },
  ribbonMeta: {
    marginTop: 3,
    fontSize: 11,
    color: MUTED,
  },
  ribbonLiveBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 8,
  },
  ribbonLiveLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#FFFFFF',
  },
  ribbonSave: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsTrack: {
    gap: 7,
    paddingRight: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEFF3',
    borderRadius: 16,
  },
  chipActive: {
    backgroundColor: THEME_COLOR,
    borderColor: THEME_COLOR,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BODY_DARK,
  },
  chipLabelActive: {
    color: '#FFFFFF',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F1F4',
    borderRadius: 16,
  },
  cardBody: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgesRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
    paddingRight: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: GREY_600,
  },
  badgeLive: {
    backgroundColor: '#FDECEA',
  },
  badgeLabelLive: {
    color: LIVE_RED,
  },
  badgeUpcoming: {
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
  },
  badgeLabelUpcoming: {
    color: THEME_COLOR,
  },
  badgeExtra: {
    backgroundColor: '#FFF8E1',
  },
  badgeLabelExtra: {
    color: '#B7791F',
  },
  badgeFree: {
    backgroundColor: '#E8F5E9',
  },
  badgeLabelFree: {
    color: '#2E7D32',
  },
  saveButton: {
    padding: 4,
  },
  cardTitle: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '700',
    color: BODY_DARK,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  cardOrg: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    color: GREY_600,
  },
  cardMeta: {
    marginTop: 3,
    fontSize: 12,
    color: MUTED,
  },
  cardChevron: {
    marginLeft: -4,
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
