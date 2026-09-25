import { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  GREY_600,
  GREY_700,
  GREY_800,
  THEME_COLOR,
  withAlpha,
} from './theme';
import { MOCK_SPEAKERS, Speaker } from './mock';
import SupabaseService from '../services/supabase';

function SpeakerAvatar({ speaker, size }: { speaker: Speaker; size: number }) {
  const [failed, setFailed] = useState(false);
  const uri = !failed ? (speaker.photo ?? '').trim() : '';
  if (!uri) {
    return (
      <View
        style={[
          styles.avatarFallback,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="account"
          size={size * 0.58}
          color={THEME_COLOR}
        />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      onError={() => setFailed(true)}
    />
  );
}

export default function KeynoteSpeakersPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<Speaker | null>(null);
  // Same business logic as webapp fetchKeynoteSpeakers.
  // Falls back to mock data when offline / pre-auth (UI unchanged).
  const [speakers, setSpeakers] = useState<Speaker[]>(MOCK_SPEAKERS);

  async function loadSpeakers() {
    try {
      const rows = await SupabaseService.fetchKeynoteSpeakers();
      if (rows.length === 0) return false;
      setSpeakers(
        rows.map((sp) => ({
          id: String(sp['id'] ?? ''),
          name: String(sp['name'] ?? 'Speaker'),
          title: String(sp['title'] ?? 'Presenter'),
          institution: String(sp['company'] ?? ''),
          bio: String(sp['bio'] ?? ''),
          photo: String(sp['photo'] ?? ''),
        })),
      );
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    loadSpeakers();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await loadSpeakers();
    setRefreshing(false);
  }

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={THEME_COLOR}
          />
        }
      >
        {speakers.length === 0 ? (
          <Text style={styles.emptyText}>
            No keynote speakers available yet.
          </Text>
        ) : (
          speakers.map((speaker) => (
            <View key={speaker.id} style={styles.card}>
              <View style={styles.avatarRing}>
                <SpeakerAvatar speaker={speaker} size={120} />
              </View>
              <Text style={styles.name}>{speaker.name || 'Unknown Speaker'}</Text>
              {(speaker.title || 'Presenter').length > 0 && (
                <Text style={styles.titleText}>
                  {speaker.title || 'Presenter'}
                </Text>
              )}
              {speaker.institution.length > 0 && (
                <View style={styles.institutionPill}>
                  <Text style={styles.institutionText}>
                    {speaker.institution}
                  </Text>
                </View>
              )}
              <Pressable
                accessibilityRole="button"
                onPress={() => setSelected(speaker)}
                style={({ pressed }) => [
                  styles.bioButton,
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons
                  name="account"
                  size={18}
                  color="#FFFFFF"
                />
                <Text style={styles.bioButtonLabel}>Read Bio</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <View style={styles.dialogBackdrop}>
          <ScrollView
            contentContainerStyle={styles.dialogScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.dialogAvatar}>
              {selected && <SpeakerAvatar speaker={selected} size={130} />}
            </View>
            <View style={styles.dialog}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setSelected(null)}
                style={styles.dialogClose}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={GREY_600}
                />
              </Pressable>
              <Text style={styles.dialogName}>{selected?.name}</Text>
              {selected?.title ? (
                <View style={styles.dialogChip}>
                  <MaterialCommunityIcons
                    name="school"
                    size={16}
                    color={THEME_COLOR}
                  />
                  <Text style={styles.dialogChipText}>{selected.title}</Text>
                </View>
              ) : null}
              {selected?.institution ? (
                <View style={styles.dialogChip}>
                  <MaterialCommunityIcons
                    name="office-building"
                    size={16}
                    color={THEME_COLOR}
                  />
                  <Text style={styles.dialogChipText}>
                    {selected.institution}
                  </Text>
                </View>
              ) : null}
              <View style={styles.divider} />
              <View style={styles.dialogChip}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={16}
                  color={THEME_COLOR}
                />
                <Text style={styles.aboutLabel}>About</Text>
              </View>
              <Text style={styles.bioText}>
                {selected?.bio || 'No biography available.'}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    opacity: 0.7,
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyText: {
    marginTop: 40,
    fontSize: 16,
    color: GREY_600,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: withAlpha(THEME_COLOR, '14'),
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarRing: {
    padding: 3,
    borderRadius: 66,
    borderWidth: 3,
    borderColor: THEME_COLOR,
  },
  avatarFallback: {
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLOR,
    textAlign: 'center',
  },
  titleText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: GREY_700,
    textAlign: 'center',
  },
  institutionPill: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    borderRadius: 20,
  },
  institutionText: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_COLOR,
    textAlign: 'center',
  },
  bioButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: THEME_COLOR,
    borderRadius: 30,
    elevation: 4,
    shadowColor: THEME_COLOR,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  bioButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  dialogScroll: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  dialogAvatar: {
    zIndex: 1,
    marginBottom: -65,
    padding: 5,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: withAlpha(THEME_COLOR, '4D'),
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    paddingTop: 100,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 15 },
  },
  dialogClose: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  dialogName: {
    fontSize: 23,
    fontWeight: '700',
    color: '#2D2D2D',
    textAlign: 'center',
    lineHeight: 30,
  },
  dialogChip: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    borderRadius: 8,
  },
  dialogChipText: {
    fontSize: 15,
    fontWeight: '500',
    color: GREY_700,
  },
  divider: {
    marginTop: 24,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  aboutLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLOR,
  },
  bioText: {
    marginTop: 14,
    fontSize: 14,
    color: GREY_800,
    lineHeight: 26,
  },
});
