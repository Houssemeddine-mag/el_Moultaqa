import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
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
import type { DiscoveryEvent } from './discovery/types';
import {
  categoryIcon,
  formatCategory,
  formatShortDate,
  statusOf,
} from './discovery/utils';

type ConferenceDetailPageProps = {
  event: DiscoveryEvent;
  onBack?: () => void;
  onEnter?: () => void;
  saved?: boolean;
  onToggleSave?: () => void;
  entering?: boolean;
};

function MetaRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.metaRow}>
      <View style={styles.metaIcon}>
        <MaterialCommunityIcons name={icon} size={17} color={THEME_COLOR} />
      </View>
      <View style={styles.metaTextWrap}>
        <Text style={styles.metaLabel}>{label}</Text>
        <Text style={styles.metaValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
      {onPress && (
        <MaterialCommunityIcons name="open-in-new" size={16} color={MUTED} />
      )}
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="link" onPress={onPress}>
      {content}
    </Pressable>
  );
}

export default function ConferenceDetailPage({
  event,
  onBack,
  onEnter,
  saved,
  onToggleSave,
  entering,
}: ConferenceDetailPageProps) {
  const status = statusOf(event);
  const dateLabel = event.end_date
    ? `${formatShortDate(event.start_date)} – ${formatShortDate(event.end_date)}`
    : formatShortDate(event.start_date);
  const website = event.official_website_url || event.webapp_url;
  const ctaLabel = entering
    ? 'Opening…'
    : status.type === 'live'
      ? 'Join Live'
      : status.type === 'ended'
        ? 'Open Recap'
        : 'Enter Conference';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {event.logo_url ? (
            <Image
              source={{ uri: event.logo_url }}
              style={styles.banner}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[THEME_COLOR, '#1FB69A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.banner, styles.bannerFallback]}
            >
              <Text style={styles.bannerLetter}>
                {(event.title || 'C').slice(0, 1).toUpperCase()}
              </Text>
            </LinearGradient>
          )}
          <View style={styles.bannerOverlay} pointerEvents="none" />
          <View style={styles.bannerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={onBack}
              hitSlop={12}
              style={styles.circleButton}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color={BODY_DARK}
              />
            </Pressable>
            {onToggleSave && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark'}
                onPress={onToggleSave}
                hitSlop={12}
                style={styles.circleButton}
              >
                <MaterialCommunityIcons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={saved ? THEME_COLOR : BODY_DARK}
                />
              </Pressable>
            )}
          </View>
          {status.type === 'live' && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveLabel}>LIVE NOW</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.badgesRow}>
            <View
              style={[
                styles.badge,
                status.type === 'live' && styles.badgeLive,
                status.type === 'upcoming' && styles.badgeUpcoming,
              ]}
            >
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
                  Free entry
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{event.title}</Text>
          {event.org_name ? (
            <Text style={styles.org}>by {event.org_name}</Text>
          ) : null}
          <View style={styles.categoryRow}>
            <MaterialCommunityIcons
              name={categoryIcon(event.category) as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
              size={14}
              color={THEME_COLOR}
            />
            <Text style={styles.categoryLabel}>
              {formatCategory(event.category)}
            </Text>
          </View>

          <View style={styles.divider} />

          {dateLabel ? (
            <MetaRow icon="calendar-month-outline" label="Date" value={dateLabel} />
          ) : null}
          {event.start_time ? (
            <MetaRow icon="clock-outline" label="Time" value={event.start_time} />
          ) : null}
          {event.location ? (
            <MetaRow
              icon="map-marker-outline"
              label="Location"
              value={event.location}
            />
          ) : null}
          {event.pricing ? (
            <MetaRow
              icon="ticket-outline"
              label="Pricing"
              value={event.pricing === 'free' ? 'Free' : event.pricing}
            />
          ) : null}
          {website ? (
            <MetaRow
              icon="web"
              label="Website"
              value={website.replace(/^https?:\/\//, '')}
              onPress={() => Linking.openURL(website)}
            />
          ) : null}

          {event.description ? (
            <>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{event.description}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.ctaBar}>
        <View style={styles.ctaInfo}>
          <Text style={styles.ctaPrice}>
            {event.pricing === 'free' ? 'Free' : 'Registration'}
          </Text>
          <Text style={styles.ctaSub} numberOfLines={1}>
            {event.location || formatCategory(event.category)}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onEnter}
          disabled={entering}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && !entering && styles.pressed,
            entering && styles.disabled,
          ]}
        >
          {entering ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            status.type === 'live' && <View style={styles.ctaDot} />
          )}
          <Text style={styles.ctaLabel}>{ctaLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.85,
  },
  banner: {
    width: '100%',
    height: 220,
  },
  bannerFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerLetter: {
    fontSize: 84,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.9)',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    height: 220,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  bannerActions: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  liveBadge: {
    position: 'absolute',
    left: 16,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: LIVE_RED,
  },
  liveLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  body: {
    padding: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
    backgroundColor: '#F3F4F6',
  },
  badgeLabel: {
    fontSize: 11,
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
  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
    color: BODY_DARK,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  org: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
    color: GREY_600,
  },
  categoryRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME_COLOR,
  },
  divider: {
    marginVertical: 14,
    height: 1,
    backgroundColor: '#F0F1F4',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 7,
  },
  metaIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaTextWrap: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metaValue: {
    marginTop: 1,
    fontSize: 14,
    fontWeight: '600',
    color: BODY_DARK,
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '800',
    color: BODY_DARK,
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: GREY_600,
    lineHeight: 22,
  },
  ctaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F1F4',
  },
  ctaInfo: {
    flex: 1,
  },
  ctaPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: BODY_DARK,
  },
  ctaSub: {
    marginTop: 1,
    fontSize: 12,
    color: MUTED,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 26,
    height: 50,
    backgroundColor: THEME_COLOR,
    borderRadius: 14,
    elevation: 3,
    shadowColor: THEME_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  ctaLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
