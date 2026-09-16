import { useEffect, useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import {
  BODY_DARK,
  GREY_600,
  MUTED,
  THEME_COLOR,
  withAlpha,
} from './theme';
import { MOCK_CONFERENCE, MOCK_SESSIONS, MOCK_SPEAKERS, MOCK_STREAMS, Session } from './mock';

type HomePageProps = {
  onNavigateToProgram?: () => void;
  onNavigateToKeynotes?: () => void;
};

const PAGE_BG = '#F4F7F5';

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000) % 24;
  const minutes = Math.floor(diff / 60000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;
  return {
    live: diff <= 0,
    parts: [
      { value: pad(days), label: 'days' },
      { value: pad(hours), label: 'hrs' },
      { value: pad(minutes), label: 'min' },
      { value: pad(seconds), label: 'sec' },
    ],
  };
}

function MetaPill({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.metaPill}>
      <MaterialCommunityIcons
        name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
        size={14}
        color="#FFFFFF"
      />
      <Text style={styles.metaPillText} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <MaterialCommunityIcons
          name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={22}
          color={THEME_COLOR}
        />
      </View>
      <View style={styles.statText}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

function UpcomingCard({
  session,
  onPress,
}: {
  session: Session;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.eventCard, pressed && styles.pressed]}
    >
      <View style={styles.eventLeading}>
        <MaterialCommunityIcons
          name="calendar-clock"
          size={22}
          color={THEME_COLOR}
        />
      </View>
      <View style={styles.eventBody}>
        <Text style={styles.eventTitle} numberOfLines={1}>
          {session.title || 'Session'}
        </Text>
        {session.speaker.length > 0 ? (
          <Text style={styles.eventSpeaker} numberOfLines={1}>
            {session.speaker}
          </Text>
        ) : null}
        {session.time.length > 0 ? (
          <View style={styles.eventTimeRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={13}
              color={MUTED}
            />
            <Text style={styles.eventTime}>{session.time}</Text>
            {session.room.length > 0 ? (
              <Text style={styles.eventTime}> • {session.room}</Text>
            ) : null}
          </View>
        ) : null}
      </View>
      <View style={styles.eventTrailing}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color={THEME_COLOR}
        />
      </View>
    </Pressable>
  );
}

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable accessibilityRole="button" onPress={onAction}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function HomePage({
  onNavigateToProgram,
  onNavigateToKeynotes,
}: HomePageProps) {
  const conference = MOCK_CONFERENCE;
  const countdown = useCountdown(conference.startDate);
  const [selected, setSelected] = useState<Session | null>(null);

  const highlightDays = new Set(
    MOCK_SESSIONS.map((session) => session.date),
  ).size;

  const upcoming = [...MOCK_SESSIONS].slice(0, 3);
  const totalSessions = MOCK_SESSIONS.length;
  const keynoteCount = MOCK_SESSIONS.filter((session) =>
    session.title.toLowerCase().includes('keynote'),
  ).length;

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[THEME_COLOR, '#1FB69A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroCircleLarge} />
        <View style={styles.heroCircleSmall} />
        <Text style={styles.heroEyebrow}>Welcome to</Text>
        <Text style={styles.heroTitle}>{conference.name || 'Conference'}</Text>
        {conference.description.length > 0 && (
          <Text style={styles.heroDescription} numberOfLines={2}>
            {conference.description}
          </Text>
        )}
        <View style={styles.heroMeta}>
          <MetaPill
            icon="calendar-today"
            text={conference.startDate.toDateString()}
          />
          {conference.location.length > 0 && (
            <MetaPill icon="map-marker-outline" text={conference.location} />
          )}
          {conference.totalParticipants > 0 && (
            <MetaPill
              icon="account-group"
              text={`${conference.totalParticipants}+ Participants`}
            />
          )}
        </View>
        {countdown.live ? (
          <View style={styles.liveStrip}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>The conference is in progress!</Text>
          </View>
        ) : (
          <View style={styles.countdownStrip}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={18}
              color="#FFFFFF"
            />
            <Text style={styles.countdownLabel}>Starts in</Text>
            <View style={styles.countdownParts}>
              {countdown.parts.map((part, index) => (
                <View key={part.label} style={styles.countdownPart}>
                  <Text style={styles.countdownValue}>{part.value}</Text>
                  <Text style={styles.countdownUnit}>{part.label}</Text>
                  {index < countdown.parts.length - 1 && (
                    <Text style={styles.countdownColon}>:</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </LinearGradient>

      <View style={styles.statsRow}>
        <StatCard
          icon="presentation"
          value={String(totalSessions)}
          label="Sessions"
        />
        <StatCard
          icon="microphone"
          value={String(keynoteCount)}
          label="Keynotes"
        />
      </View>

      <SectionHeader
        title="Upcoming Sessions"
        action="See all"
        onAction={onNavigateToProgram}
      />
      {upcoming.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons
              name="calendar-remove"
              size={28}
              color={THEME_COLOR}
            />
          </View>
          <Text style={styles.emptyTitle}>No upcoming sessions</Text>
          <Text style={styles.emptySubtitle}>Check the full program</Text>
        </View>
      ) : (
        <View style={styles.eventList}>
          {upcoming.map((session) => (
            <UpcomingCard
              key={session.id}
              session={session}
              onPress={() => setSelected(session)}
            />
          ))}
        </View>
      )}

      <View style={styles.navRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onNavigateToProgram}
          style={({ pressed }) => [
            styles.navPrimary,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={18}
            color="#FFFFFF"
          />
          <Text style={styles.navPrimaryLabel}>Full program</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onNavigateToKeynotes}
          style={({ pressed }) => [styles.navTonal, pressed && styles.pressed]}
        >
          <MaterialCommunityIcons
            name="microphone"
            size={18}
            color={THEME_COLOR}
          />
          <Text style={styles.navTonalLabel}>Keynotes</Text>
        </Pressable>
      </View>

      <SectionHeader title={`About ${conference.name || 'Conference'}`} />
      <View style={styles.aboutCard}>
        <Text style={styles.aboutBody}>{conference.description}</Text>
        <View style={styles.aboutHighlights}>
          <View style={styles.aboutHighlight}>
            <Text style={styles.aboutHighlightValue}>{highlightDays}</Text>
            <Text style={styles.aboutHighlightLabel}>Days</Text>
          </View>
          <View style={styles.aboutHighlightDivider} />
          <View style={styles.aboutHighlight}>
            <Text style={styles.aboutHighlightValue}>
              {MOCK_SPEAKERS.length}
            </Text>
            <Text style={styles.aboutHighlightLabel}>Speakers</Text>
          </View>
          <View style={styles.aboutHighlightDivider} />
          <View style={styles.aboutHighlight}>
            <Text style={styles.aboutHighlightValue}>
              {MOCK_STREAMS.length}
            </Text>
            <Text style={styles.aboutHighlightLabel}>Live streams</Text>
          </View>
        </View>
        {conference.website.length > 0 && (
          <Pressable
            accessibilityRole="button"
            onPress={() => Linking.openURL(conference.website)}
            style={({ pressed }) => [
              styles.websiteButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.websiteLabel}>Visit website</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={18}
              color="#FFFFFF"
            />
          </Pressable>
        )}
      </View>

      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.dialogBackdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>{selected?.title}</Text>
            {selected?.speaker ? (
              <View style={styles.dialogRow}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={16}
                  color={GREY_600}
                />
                <Text style={styles.dialogText}>{selected.speaker}</Text>
              </View>
            ) : null}
            {selected?.time ? (
              <View style={styles.dialogRow}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={GREY_600}
                />
                <Text style={styles.dialogText}>{selected.time}</Text>
              </View>
            ) : null}
            <View style={styles.dialogActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setSelected(null)}
              >
                <Text style={styles.dialogClose}>Close</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setSelected(null);
                  onNavigateToProgram?.();
                }}
                style={styles.dialogPrimary}
              >
                <Text style={styles.dialogPrimaryLabel}>View full program</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
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
  hero: {
    width: '100%',
    padding: 22,
    borderRadius: 26,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: THEME_COLOR,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  heroCircleLarge: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroCircleSmall: {
    position: 'absolute',
    bottom: -50,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
  },
  heroTitle: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  heroDescription: {
    marginTop: 10,
    fontSize: 14,
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 21,
  },
  heroMeta: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderRadius: 20,
  },
  metaPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    maxWidth: 180,
  },
  countdownStrip: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderRadius: 16,
  },
  countdownLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  countdownParts: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  countdownPart: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  countdownValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  countdownUnit: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginLeft: 2,
    marginRight: 2,
  },
  countdownColon: {
    fontSize: 15,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    marginHorizontal: 2,
  },
  liveStrip: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderRadius: 16,
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5252',
  },
  liveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  statIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: BODY_DARK,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  sectionHeader: {
    marginTop: 26,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: BODY_DARK,
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  emptyBox: {
    padding: 28,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: BODY_DARK,
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: MUTED,
  },
  eventList: {
    gap: 10,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  eventLeading: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventBody: {
    flex: 1,
    marginLeft: 12,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: BODY_DARK,
  },
  eventSpeaker: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '500',
    color: GREY_600,
  },
  eventTimeRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    marginLeft: 4,
    fontSize: 12,
    color: MUTED,
  },
  eventTrailing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  navPrimary: {
    flex: 1,
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
  navPrimaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  navTonal: {
    flex: 1,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    borderRadius: 16,
  },
  navTonalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  aboutCard: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  aboutBody: {
    fontSize: 15,
    color: BODY_DARK,
    lineHeight: 25,
  },
  aboutHighlights: {
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutHighlight: {
    flex: 1,
    alignItems: 'center',
  },
  aboutHighlightValue: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME_COLOR,
  },
  aboutHighlightLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: MUTED,
  },
  aboutHighlightDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#F0F0F0',
  },
  websiteButton: {
    marginTop: 16,
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
  websiteLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
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
    borderRadius: 20,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME_COLOR,
  },
  dialogRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dialogText: {
    flex: 1,
    fontSize: 14,
    color: GREY_600,
  },
  dialogActions: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 18,
  },
  dialogClose: {
    fontSize: 14,
    fontWeight: '600',
    color: MUTED,
  },
  dialogPrimary: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
  },
  dialogPrimaryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
