import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  GREY_400,
  GREY_500,
  GREY_600,
  LIVE_RED,
  MUTED,
  THEME_COLOR,
  withAlpha,
} from './theme';
import { MOCK_STREAMS, StreamItem } from './mock';
import SupabaseService from '../services/supabase';

type LivePageProps = {
  onOpenStream?: (stream: StreamItem) => void;
};

export function LivePill() {
  return (
    <View style={styles.livePill}>
      <View style={styles.liveDot} />
      <Text style={styles.liveText}>LIVE</Text>
    </View>
  );
}

export default function LivePage({ onOpenStream }: LivePageProps) {
  // Same business logic as webapp LivePage: streams from events.settings.streams.
  // Falls back to mock data when offline / pre-auth (UI unchanged).
  const [streams, setStreams] = useState<StreamItem[]>(MOCK_STREAMS);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await SupabaseService.getStreams();
        if (!active || rows.length === 0) return;
        setStreams(
          rows.map((s) => ({
            id: String(s['id'] ?? ''),
            name: String(s['name'] ?? ''),
            url: String(s['url'] ?? ''),
          })),
        );
      } catch {
        // keep mock fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Live Streams</Text>
      <Text style={styles.subtitle}>Choose a stream to watch live.</Text>
      {streams.length === 0 ? (
        <View style={styles.emptyWrap}>
          <MaterialCommunityIcons
            name="television"
            size={64}
            color={GREY_400}
          />
          <Text style={styles.emptyTitle}>No live streams available</Text>
          <Text style={styles.emptySubtitle}>
            Streams will appear here once the conference admin adds them.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {streams.map((stream) => (
            <Pressable
              key={stream.id}
              accessibilityRole="button"
              onPress={() => onOpenStream?.(stream)}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="video"
                  size={28}
                  color={THEME_COLOR}
                />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {stream.name}
                </Text>
                <Text style={styles.cardHint}>Tap to watch</Text>
              </View>
              <LivePill />
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: MUTED,
    lineHeight: 21,
  },
  list: {
    marginTop: 20,
    gap: 12,
  },
  card: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    marginLeft: 14,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardHint: {
    marginTop: 2,
    fontSize: 13,
    color: GREY_500,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: withAlpha(LIVE_RED, '1F'),
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: LIVE_RED,
  },
  liveText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: LIVE_RED,
  },
  emptyWrap: {
    paddingTop: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: GREY_600,
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: GREY_500,
    textAlign: 'center',
  },
});
