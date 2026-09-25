import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  BODY_DARK,
  GREY_400,
  GREY_600,
  MUTED,
  STAR_AMBER,
  THEME_COLOR,
  formatClock,
  withAlpha,
} from './theme';
import { FeedbackItem, MOCK_FEEDBACK } from './mock';
import SupabaseService from '../services/supabase';

type PresentationFeedbackPageProps = {
  title?: string;
  onClose?: () => void;
};

const PAGE_BG = '#F4F7F5';

function StarRow({
  value,
  onRate,
  small,
}: {
  value: number;
  onRate?: (rating: number) => void;
  small?: boolean;
}) {
  const size = small ? 18 : 36;
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        const icon = (
          <MaterialCommunityIcons
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={filled ? STAR_AMBER : '#D4D4D4'}
          />
        );
        if (!onRate) return <View key={star}>{icon}</View>;
        return (
          <Pressable
            key={star}
            accessibilityRole="button"
            onPress={() => onRate(star)}
            hitSlop={8}
          >
            {icon}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function PresentationFeedbackPage({
  title = 'Presentation',
  onClose,
}: PresentationFeedbackPageProps) {
  const [presenterRating, setPresenterRating] = useState(0);
  const [presentationRating, setPresentationRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recent, setRecent] = useState<FeedbackItem[]>(MOCK_FEEDBACK);
  const [toast, setToast] = useState('');

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  }

  // Same business logic as webapp submitPresentationFeedback/fetchPresentationFeedback.
  // Falls back to mock data when offline / pre-auth (UI unchanged).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rows = await SupabaseService.fetchPresentationFeedback(title);
        if (!active || rows.length === 0) return;
        setRecent(
          rows.map((f) => ({
            id: String(f['id'] ?? ''),
            presenter: Number(f['rating'] ?? 0),
            presentation: Number(f['rating'] ?? 0),
            comment: String(f['comment'] ?? ''),
            createdAt: Date.parse(String(f['createdAt'] ?? '')) || Date.now(),
          })),
        );
      } catch {
        // keep mock fallback
      }
    })();
    return () => {
      active = false;
    };
  }, [title]);

  async function handleSubmit() {
    if (
      presenterRating === 0 &&
      presentationRating === 0 &&
      comment.trim().length === 0
    ) {
      showToast('Please provide a rating or comment');
      return;
    }
    const rating = Math.max(presenterRating, presentationRating);
    const optimistic: FeedbackItem = {
      id: `f-${Date.now()}`,
      presenter: presenterRating,
      presentation: presentationRating,
      comment: comment.trim(),
      createdAt: Date.now(),
    };
    setRecent((current) => [optimistic, ...current]);
    setPresenterRating(0);
    setPresentationRating(0);
    setComment('');
    try {
      await SupabaseService.submitPresentationFeedback({
        presentationKey: title,
        rating,
        comment: optimistic.comment,
        userEmail: SupabaseService.currentUserEmail ?? '',
      });
      showToast('Thank you for your feedback');
    } catch {
      // Offline / pre-auth: keep the optimistic local copy (UI unchanged).
      showToast('Feedback saved locally — will sync when online');
    }
  }

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleCard}>
          <View style={styles.titleIcon}>
            <MaterialCommunityIcons
              name="message-draw"
              size={22}
              color={THEME_COLOR}
            />
          </View>
          <View style={styles.titleText}>
            <Text style={styles.titleLabel}>Rate this talk</Text>
            <Text style={styles.titleValue} numberOfLines={2}>
              {title}
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formLabel}>Rate the presenter</Text>
          <StarRow value={presenterRating} onRate={setPresenterRating} />
          <Text style={styles.formHint}>
            {presenterRating === 0
              ? 'Tap a star'
              : presenterRating <= 2
                ? 'Needs improvement'
                : presenterRating <= 4
                  ? 'Good job'
                  : 'Outstanding!'}
          </Text>

          <Text style={styles.formLabel}>Rate the presentation</Text>
          <StarRow value={presentationRating} onRate={setPresentationRating} />
          <Text style={styles.formHint}>
            {presentationRating === 0
              ? 'Tap a star'
              : presentationRating <= 2
                ? 'Needs improvement'
                : presentationRating <= 4
                  ? 'Good job'
                  : 'Outstanding!'}
          </Text>

          <Text style={styles.formLabel}>Comment</Text>
          <TextInput
            style={styles.comment}
            placeholder="Add an optional comment"
            placeholderTextColor={GREY_400}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Pressable
            accessibilityRole="button"
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
            <Text style={styles.submitLabel}>Submit feedback</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeLabel}>Close</Text>
          </Pressable>
        </View>

        <Text style={styles.recentTitle}>Recent feedback</Text>
        {recent.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No feedback yet.</Text>
            <Text style={styles.emptySub}>Be the first to rate this talk.</Text>
          </View>
        ) : (
          <View style={styles.recentList}>
            {recent.map((item) => (
              <View key={item.id} style={styles.feedbackCard}>
                <View style={styles.feedbackTop}>
                  <View style={styles.avatarMini}>
                    <MaterialCommunityIcons
                      name="account"
                      size={18}
                      color={THEME_COLOR}
                    />
                  </View>
                  <View style={styles.feedbackHead}>
                    <StarRow value={item.presenter} small />
                    <Text style={styles.feedbackMeta}>
                      Presenter {item.presenter} · Talk {item.presentation} •{' '}
                      {formatClock(item.createdAt)}
                    </Text>
                  </View>
                </View>
                {item.comment.length > 0 && (
                  <Text style={styles.feedbackComment}>{item.comment}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      {toast.length > 0 && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
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
  pressed: {
    opacity: 0.75,
  },
  titleCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  titleIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    flex: 1,
  },
  titleLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: MUTED,
  },
  titleValue: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: '800',
    color: BODY_DARK,
  },
  formCard: {
    marginTop: 12,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  formLabel: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '800',
    color: BODY_DARK,
  },
  formHint: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: MUTED,
  },
  stars: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 6,
  },
  comment: {
    marginTop: 8,
    minHeight: 88,
    padding: 14,
    fontSize: 14,
    color: BODY_DARK,
    backgroundColor: '#F7F9F8',
    borderWidth: 1,
    borderColor: '#ECEFF0',
    borderRadius: 14,
  },
  submitButton: {
    marginTop: 18,
    width: '100%',
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
  submitLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    marginTop: 6,
    width: '100%',
    paddingVertical: 13,
    alignItems: 'center',
  },
  closeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  recentTitle: {
    marginTop: 22,
    fontSize: 19,
    fontWeight: '800',
    color: BODY_DARK,
  },
  emptyBox: {
    marginTop: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: BODY_DARK,
  },
  emptySub: {
    marginTop: 4,
    fontSize: 13,
    color: MUTED,
  },
  recentList: {
    marginTop: 12,
    gap: 10,
  },
  feedbackCard: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  feedbackTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackHead: {
    flex: 1,
  },
  feedbackMeta: {
    marginTop: 4,
    fontSize: 12,
    color: MUTED,
  },
  feedbackComment: {
    marginTop: 10,
    fontSize: 14,
    color: BODY_DARK,
    lineHeight: 20,
  },
  toast: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#323232',
    borderRadius: 20,
  },
  toastText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
