import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  BODY_DARK,
  GREY_500,
  GREY_600,
  MUTED,
  THEME_COLOR,
  formatDayLabel,
  withAlpha,
} from './theme';
import { MOCK_SESSIONS, Presentation, Session } from './mock';
import SupabaseService from '../services/supabase';

type ProgramPageProps = {
  onFeedback?: (title: string) => void;
};

const PAGE_BG = '#F4F7F5';

function PresentationRow({
  presentation,
  onPress,
}: {
  presentation: Presentation;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.presentation, pressed && styles.pressed]}
    >
      <View style={styles.presentationAccent} />
      <View style={styles.presentationBody}>
        <View style={styles.presentationTop}>
          <Text style={styles.presentationTitle} numberOfLines={2}>
            {presentation.title || 'Presentation'}
          </Text>
          <View style={styles.presentationTimePill}>
            <Text style={styles.presentationTime}>{presentation.time}</Text>
          </View>
        </View>
        {presentation.speaker.length > 0 && (
          <View style={styles.presentationSpeaker}>
            <MaterialCommunityIcons
              name="account-outline"
              size={14}
              color={GREY_600}
            />
            <Text style={styles.presentationSpeakerText} numberOfLines={1}>
              {presentation.speaker}
            </Text>
          </View>
        )}
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={18}
        color={THEME_COLOR}
      />
    </Pressable>
  );
}

function SessionCard({
  session,
  onFeedback,
}: {
  session: Session;
  onFeedback: (title: string) => void;
}) {
  return (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHead}>
        <View style={styles.sessionTimeTile}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color={THEME_COLOR}
          />
        </View>
        <View style={styles.sessionHeadText}>
          <Text style={styles.sessionTitle}>{session.title || 'Session'}</Text>
          {session.time.length > 0 && (
            <Text style={styles.sessionTime}>{session.time}</Text>
          )}
        </View>
        {session.room.length > 0 && (
          <View style={styles.roomPill}>
            <Text style={styles.roomPillText} numberOfLines={1}>
              {session.room}
            </Text>
          </View>
        )}
      </View>
      {session.presentations.length > 0 && (
        <View style={styles.presentationList}>
          {session.presentations.map((presentation) => (
            <PresentationRow
              key={presentation.id}
              presentation={presentation}
              onPress={() => onFeedback(presentation.title)}
            />
          ))}
        </View>
      )}
      {session.chairs.length > 0 && (
        <View style={styles.chairsRow}>
          <MaterialCommunityIcons
            name="account-group"
            size={14}
            color={MUTED}
          />
          <Text style={styles.chairsText}>
            Chairs: {session.chairs.join(', ')}
          </Text>
        </View>
      )}
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
          size={20}
          color={THEME_COLOR}
        />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProgramPage({ onFeedback }: ProgramPageProps) {
  // Same business logic as webapp fetchAllPrograms (wall-clock parsing, conferences).
  // Falls back to mock data when offline / pre-auth (UI unchanged).
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await SupabaseService.fetchAllPrograms();
        if (!active || rows.length === 0) return;
        setSessions(
          rows.map((p) => {
            const start = String(p['start'] ?? '');
            const end = String(p['end'] ?? '');
            const keynote = (p['keynote'] as Record<string, unknown> | null) ?? null;
            const conferences = (Array.isArray(p['conferences']) ? p['conferences'] : []) as Record<string, unknown>[];
            return {
              id: String(p['id'] ?? ''),
              title: String(p['title'] ?? 'Session'),
              date: String(p['date'] ?? ''),
              time: start && end ? `${start} - ${end}` : start,
              room: String(p['room'] ?? ''),
              speaker: String(keynote?.['name'] ?? ''),
              chairs: (Array.isArray(p['chairs']) ? p['chairs'] : []).map(String),
              presentations: conferences.map((c, idx) => {
                const cStart = String(c['start'] ?? '');
                const cEnd = String(c['end'] ?? '');
                return {
                  id: String(c['id'] ?? `${p['id']}-conf-${idx}`),
                  title: String(c['title'] ?? 'Presentation'),
                  time: String(c['time'] ?? (cStart && cEnd ? `${cStart} - ${cEnd}` : cStart)),
                  speaker: String(c['presenter'] ?? ''),
                };
              }),
            };
          }),
        );
      } catch {
        // keep mock fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const dates = useMemo(() => {
    const seen: string[] = [];
    for (const session of sessions) {
      if (!seen.includes(session.date)) seen.push(session.date);
    }
    return seen.sort();
  }, [sessions]);
  const [activeDate, setActiveDate] = useState(dates[0] ?? '');

  // Keep the selected day valid when real data arrives after mount.
  useEffect(() => {
    if (!dates.includes(activeDate) && dates.length > 0) {
      setActiveDate(dates[0]);
    }
  }, [dates, activeDate]);

  const daySessions = sessions.filter(
    (session) => session.date === activeDate,
  );
  const presentationCount = sessions.reduce(
    (total, session) => total + (session.presentations.length || 1),
    0,
  );

  if (dates.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIcon}>
          <MaterialCommunityIcons
            name="calendar-today"
            size={30}
            color={THEME_COLOR}
          />
        </View>
        <Text style={styles.emptyTitle}>No program available</Text>
        <Text style={styles.emptySubtitle}>
          The conference schedule will be available soon
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Program</Text>
          <Text style={styles.headerSubtitle}>
            {dates.length}-day schedule • {sessions.length} sessions
          </Text>
        </View>
        <View style={styles.headerBadge}>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={22}
            color={THEME_COLOR}
          />
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard
          icon="calendar-today"
          value={String(dates.length)}
          label="Days"
        />
        <StatCard
          icon="presentation"
          value={String(sessions.length)}
          label="Sessions"
        />
        <StatCard
          icon="microphone"
          value={String(presentationCount)}
          label="Talks"
        />
      </View>

      <View style={styles.tabs}>
        {dates.map((date, index) => {
          const active = date === activeDate;
          return (
            <Pressable
              key={date}
              accessibilityRole="tab"
              onPress={() => setActiveDate(date)}
              style={({ pressed }) => [
                styles.tab,
                active && styles.tabActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.tabDay, active && styles.tabDayActive]}>
                Day {index + 1}
              </Text>
              <Text
                style={[styles.tabDate, active && styles.tabDateActive]}
                numberOfLines={1}
              >
                {formatDayLabel(date)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={daySessions}
        keyExtractor={(session) => session.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onFeedback={(title) => onFeedback?.(title)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  pressed: {
    opacity: 0.75,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: PAGE_BG,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '800',
    color: BODY_DARK,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: MUTED,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: BODY_DARK,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  headerBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  statsRow: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: '800',
    color: BODY_DARK,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    color: MUTED,
  },
  tabs: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: THEME_COLOR,
    elevation: 3,
    shadowColor: THEME_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tabDay: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: MUTED,
  },
  tabDayActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  tabDate: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '800',
    color: BODY_DARK,
  },
  tabDateActive: {
    color: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  sessionHead: {
    padding: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionTimeTile: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionHeadText: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: BODY_DARK,
  },
  sessionTime: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  roomPill: {
    maxWidth: 110,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    borderRadius: 20,
  },
  roomPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  presentationList: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  presentation: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F7F9F8',
    borderRadius: 14,
  },
  presentationAccent: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    backgroundColor: THEME_COLOR,
  },
  presentationBody: {
    flex: 1,
  },
  presentationTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  presentationTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: BODY_DARK,
    lineHeight: 19,
  },
  presentationTimePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  presentationTime: {
    fontSize: 11,
    fontWeight: '600',
    color: MUTED,
  },
  presentationSpeaker: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  presentationSpeakerText: {
    flex: 1,
    fontSize: 13,
    color: GREY_600,
  },
  chairsRow: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chairsText: {
    flex: 1,
    fontSize: 12,
    color: GREY_500,
  },
});
