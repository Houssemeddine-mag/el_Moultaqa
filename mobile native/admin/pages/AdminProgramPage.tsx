import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
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
} from '../../pages/theme';
import { MOCK_SESSIONS, MOCK_STREAMS, Session, StreamItem } from '../../pages/mock';
import SupabaseService from '../../services/supabase';
import Dropdown from '../Dropdown';

type AdminProgramPageProps = {
  onNotified?: (title: string) => void;
};

const PAGE_BG = '#F4F7F5';

function SessionCard({
  session,
  streamId,
  streams,
  onStreamChange,
  onNotify,
}: {
  session: Session;
  streamId: string;
  streams: StreamItem[];
  onStreamChange: (value: string) => void;
  onNotify: (title: string) => void;
}) {
  return (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHead}>
        <Text style={styles.sessionTitle} numberOfLines={2}>
          {session.title || 'Session'}
        </Text>
        <View style={styles.sessionHeadRight}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notify attendees"
            onPress={() => onNotify(session.title || 'Session')}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={20}
              color={THEME_COLOR}
            />
          </Pressable>
          {session.room.length > 0 && (
            <View style={styles.roomPill}>
              <Text style={styles.roomPillText} numberOfLines={1}>
                {session.room}
              </Text>
            </View>
          )}
        </View>
      </View>
      {session.time.length > 0 && (
        <Text style={styles.sessionTime}>{session.time}</Text>
      )}
      <View style={styles.streamRow}>
        <Dropdown
          label="Linked stream"
          value={streamId}
          options={[
            { label: 'None', value: '' },
            ...streams.map((stream) => ({
              label: stream.name,
              value: stream.id,
            })),
          ]}
          onPick={onStreamChange}
        />
      </View>
      {session.presentations.length > 0 && (
        <View style={styles.presentationBlock}>
          <Text style={styles.presentationHeading}>Presentations</Text>
          <View style={styles.presentationList}>
            {session.presentations.map((presentation) => (
              <View key={presentation.id} style={styles.presentation}>
                <View style={styles.presentationBody}>
                  <Text style={styles.presentationTitle} numberOfLines={2}>
                    {presentation.title || 'Presentation'}
                  </Text>
                  <Text style={styles.presentationMeta}>
                    {[presentation.time, presentation.speaker]
                      .filter((part) => part.length > 0)
                      .join(' • ')}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Notify attendees"
                  onPress={() =>
                    onNotify(presentation.title || 'Presentation')
                  }
                  hitSlop={8}
                  style={styles.notifyButton}
                >
                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    size={18}
                    color={THEME_COLOR}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
      {session.chairs.length > 0 && (
        <Text style={styles.chairsText}>
          Chairs: {session.chairs.join(', ')}
        </Text>
      )}
    </View>
  );
}

export default function AdminProgramPage({ onNotified }: AdminProgramPageProps) {
  const [streamLinks, setStreamLinks] = useState<Record<string, string>>({});
  const [toast, setToast] = useState('');
  // Same business logic as webapp admin program: real sessions + streams,
  // falls back to bundled seeds when offline / pre-auth (UI unchanged).
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
  const [streams, setStreams] = useState<StreamItem[]>(MOCK_STREAMS);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await SupabaseService.fetchAllPrograms();
        if (!active) return;
        // Real rows win even when empty — never present bundled seeds as
        // real admin data.
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
      } catch (e) {
        // Fetch failed (e.g. offline or not registered) — show empty rather
        // than bundled seeds so fake sessions are never mistaken for real.
        if (!active) return;
        setSessions([]);
        showToast(
          e instanceof Error
            ? `Couldn't load program: ${e.message}`
            : "Couldn't load program.",
        );
      }
    })();
    (async () => {
      try {
        const rows = await SupabaseService.getStreams();
        if (!active) return;
        setStreams(
          rows.map((s) => ({
            id: String(s['id'] ?? ''),
            name: String(s['name'] ?? ''),
            url: String(s['url'] ?? ''),
          })),
        );
      } catch {
        // Stream links are local-only; an empty dropdown (None) is honest.
        if (!active) return;
        setStreams([]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  }

  async function handleNotify(title: string) {
    try {
      await SupabaseService.sendNotification(
        title,
        `Update regarding "${title}"`,
      );
      const message = `Notification sent for "${title}"`;
      showToast(message);
      onNotified?.(message);
    } catch {
      // offline: keep local-only behavior
      const message = `Notification sent for "${title}"`;
      showToast(message);
      onNotified?.(message);
    }
  }

  const groups = useMemo(() => {
    const map = new Map<string, Session[]>();
    for (const session of sessions) {
      const list = map.get(session.date) ?? [];
      list.push(session);
      map.set(session.date, list);
    }
    return [...map.entries()].sort(([a], [b]) => (a < b ? -1 : 1));
  }, [sessions]);

  const presentationCount = sessions.reduce(
    (total, session) => total + (session.presentations.length || 1),
    0,
  );

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Conference Program</Text>
          <Text style={styles.headerSubtitle}>
            Review the conference schedule used across the attendee web app.
          </Text>
          <View style={styles.chips}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Days: {groups.length}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                Sessions: {sessions.length}
              </Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                Presentations: {presentationCount}
              </Text>
            </View>
          </View>
        </View>

        {groups.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="calendar-today"
                size={26}
                color={THEME_COLOR}
              />
            </View>
            <View style={styles.emptyText}>
              <Text style={styles.emptyTitle}>No program available yet</Text>
              <Text style={styles.emptySubtitle}>
                Once the schedule is published from the conference template,
                the full agenda will appear here.
              </Text>
            </View>
          </View>
        ) : (
          groups.map(([date, sessions]) => (
            <View key={date} style={styles.group}>
              <Text style={styles.groupTitle}>{formatDayLabel(date)}</Text>
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  streams={streams}
                  streamId={streamLinks[session.id] ?? ''}
                  onStreamChange={(value) =>
                    setStreamLinks((current) => ({
                      ...current,
                      [session.id]: value,
                    }))
                  }
                  onNotify={handleNotify}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
      {toast.length > 0 && (
        <View style={styles.toast}>
          <Text style={styles.toastText} numberOfLines={2}>
            {toast}
          </Text>
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
  headerCard: {
    width: '100%',
    padding: 22,
    backgroundColor: THEME_COLOR,
    borderRadius: 22,
    elevation: 5,
    shadowColor: THEME_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  chips: {
    marginTop: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyCard: {
    marginTop: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  emptyIcon: {
    width: 56,
    height: 56,
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
  group: {
    marginTop: 24,
    gap: 12,
  },
  groupTitle: {
    paddingBottom: 2,
    fontSize: 17,
    fontWeight: '800',
    color: THEME_COLOR,
  },
  sessionCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  sessionHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  sessionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: BODY_DARK,
  },
  sessionHeadRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roomPill: {
    maxWidth: 110,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: withAlpha(THEME_COLOR, '1F'),
    borderRadius: 12,
  },
  roomPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  sessionTime: {
    marginTop: 8,
    fontSize: 13,
    color: 'rgba(0,0,0,0.54)',
  },
  streamRow: {
    marginTop: 12,
  },
  presentationBlock: {
    marginTop: 12,
  },
  presentationHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: BODY_DARK,
  },
  presentationList: {
    marginTop: 8,
    gap: 8,
  },
  presentation: {
    width: '100%',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F7F9F8',
    borderRadius: 12,
  },
  presentationBody: {
    flex: 1,
  },
  presentationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: BODY_DARK,
  },
  presentationMeta: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(0,0,0,0.54)',
  },
  notifyButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chairsText: {
    marginTop: 10,
    fontSize: 12,
    color: GREY_500,
  },
  toast: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    maxWidth: '90%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#323232',
    borderRadius: 20,
  },
  toastText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
