import { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  ANSWER_GREEN,
  ANSWER_GREEN_DARK,
  GREY_400,
  GREY_500,
  GREY_600,
  GREY_700,
  SUCCESS_GREEN,
  TAB_UNSELECTED,
  THEME_COLOR,
  formatClock,
  withAlpha,
} from './theme';
import { MOCK_QUESTIONS, Question, StreamItem } from './mock';
import { LivePill } from './LivePage';

type StreamPlayerPageProps = {
  stream: StreamItem;
  linkedSessionTitle?: string;
  onBack?: () => void;
};

export default function StreamPlayerPage({
  stream,
  linkedSessionTitle = '',
  onBack,
}: StreamPlayerPageProps) {
  const [tab, setTab] = useState<'stream' | 'questions'>('stream');
  const [questions, setQuestions] = useState<Question[]>(MOCK_QUESTIONS);
  const [draft, setDraft] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 2000);
  }

  function submitQuestion() {
    const message = draft.trim();
    if (message.length === 0) return;
    setQuestions((current) => [
      {
        id: `q-${Date.now()}`,
        author: 'You',
        message,
        createdAt: Date.now(),
        streamId: stream.id,
      },
      ...current,
    ]);
    setDraft('');
    showToast('Question sent!');
  }

  if (fullscreen) {
    return (
      <View style={styles.fullscreen}>
        <View style={styles.fullscreenVideo}>
          <MaterialCommunityIcons name="video" size={56} color="#FFFFFF" />
          <Text style={styles.fullscreenName}>{stream.name}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setFullscreen(false)}
            style={styles.fullscreenExit}
          >
            <MaterialCommunityIcons
              name="fullscreen-exit"
              size={24}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <View style={styles.appbar}>
        <Pressable
          accessibilityRole="button"
          onPress={onBack}
          hitSlop={12}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={THEME_COLOR}
          />
        </Pressable>
        <Text style={styles.appbarTitle} numberOfLines={1}>
          {stream.name}
        </Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.videoBox}>
        <MaterialCommunityIcons name="video" size={48} color="#FFFFFF" />
        <Text style={styles.videoName} numberOfLines={1}>
          {stream.name}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setFullscreen(true)}
          style={styles.fullscreenButton}
        >
          <MaterialCommunityIcons
            name="fullscreen"
            size={24}
            color="#FFFFFF"
          />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {(
          [
            { key: 'stream', label: 'Stream' },
            { key: 'questions', label: 'Questions' },
          ] as const
        ).map((item) => {
          const active = tab === item.key;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              onPress={() => setTab(item.key)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {tab === 'stream' ? (
        <ScrollView contentContainerStyle={styles.infoContent}>
          <Text style={styles.infoName}>{stream.name}</Text>
          <View style={styles.infoRow}>
            <LivePill />
            {linkedSessionTitle.length > 0 && (
              <Text style={styles.linkedSession} numberOfLines={2}>
                {linkedSessionTitle}
              </Text>
            )}
          </View>
          <View style={styles.linkBox}>
            <MaterialCommunityIcons name="link" size={20} color={THEME_COLOR} />
            <Text style={styles.linkUrl} numberOfLines={2}>
              {stream.url}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => Linking.openURL(stream.url)}
            style={({ pressed }) => [
              styles.externalButton,
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons
              name="open-in-new"
              size={18}
              color={THEME_COLOR}
            />
            <Text style={styles.externalLabel}>Open externally</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <View style={styles.questionsWrap}>
          {questions.length === 0 ? (
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons
                name="comment-question-outline"
                size={48}
                color={GREY_400}
              />
              <Text style={styles.emptyTitle}>No questions yet</Text>
              <Text style={styles.emptySubtitle}>Ask a question below</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.questionList}>
              {questions.map((question) => (
                <View key={question.id} style={styles.questionCard}>
                  <View style={styles.questionTop}>
                    <View style={styles.authorPill}>
                      <Text style={styles.authorText}>
                        {question.author || 'Attendee'}
                      </Text>
                    </View>
                    <Text style={styles.questionTime}>
                      {formatClock(question.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.questionMessage}>{question.message}</Text>
                  {question.answer && question.answer.trim().length > 0 && (
                    <View style={styles.answerBox}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={14}
                        color={ANSWER_GREEN}
                      />
                      <Text style={styles.answerText}>{question.answer}</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}
          <View style={styles.composer}>
            <TextInput
              style={styles.composerInput}
              placeholder="Ask a question..."
              placeholderTextColor={GREY_400}
              value={draft}
              onChangeText={setDraft}
              returnKeyType="send"
              onSubmitEditing={submitQuestion}
            />
            <Pressable
              accessibilityRole="button"
              onPress={submitQuestion}
              hitSlop={8}
            >
              <MaterialCommunityIcons name="send" size={24} color={THEME_COLOR} />
            </Pressable>
          </View>
        </View>
      )}

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
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    opacity: 0.7,
  },
  appbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    alignItems: 'center',
  },
  appbarTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLOR,
    textAlign: 'center',
  },
  videoBox: {
    height: 240,
    width: '100%',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  videoName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 24,
  },
  fullscreenButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullscreenVideo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullscreenName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  fullscreenExit: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: THEME_COLOR,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TAB_UNSELECTED,
  },
  tabLabelActive: {
    color: THEME_COLOR,
  },
  infoContent: {
    padding: 16,
  },
  infoName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  infoRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkedSession: {
    flex: 1,
    fontSize: 13,
    color: GREY_600,
  },
  linkBox: {
    marginTop: 16,
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: withAlpha(THEME_COLOR, '0F'),
    borderRadius: 16,
  },
  linkUrl: {
    flex: 1,
    fontSize: 13,
    color: GREY_700,
  },
  externalButton: {
    marginTop: 12,
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: THEME_COLOR,
    borderRadius: 12,
  },
  externalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLOR,
  },
  questionsWrap: {
    flex: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: GREY_600,
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: GREY_500,
  },
  questionList: {
    padding: 16,
    gap: 8,
  },
  questionCard: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  questionTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    borderRadius: 8,
  },
  authorText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME_COLOR,
  },
  questionTime: {
    flex: 1,
    textAlign: 'right',
    fontSize: 11,
    color: GREY_500,
  },
  questionMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#000000',
  },
  answerBox: {
    marginTop: 8,
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    gap: 6,
    backgroundColor: withAlpha(SUCCESS_GREEN, '14'),
    borderRadius: 10,
  },
  answerText: {
    flex: 1,
    fontSize: 13,
    color: ANSWER_GREEN_DARK,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  composerInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
  },
  toast: {
    position: 'absolute',
    bottom: 90,
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
