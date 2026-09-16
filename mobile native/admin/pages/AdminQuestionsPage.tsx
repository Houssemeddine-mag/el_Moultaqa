import { useMemo, useState } from 'react';
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
  GREY_500,
  GREY_600,
  MUTED,
  SUCCESS_GREEN,
  THEME_COLOR,
  WARNING_ORANGE,
  withAlpha,
} from '../../pages/theme';
import { MOCK_STREAMS, Question } from '../../pages/mock';

type AdminQuestionsPageProps = {
  questions: Question[];
  onAnswer: (id: string, answer: string) => void;
  onDelete: (id: string) => void;
};

const PAGE_BG = '#F4F7F5';

function groupName(question: Question) {
  const stream = MOCK_STREAMS.find((item) => item.id === question.streamId);
  return stream?.name ?? 'General';
}

function QuestionCard({
  question,
  onAnswer,
  onDelete,
}: {
  question: Question;
  onAnswer: (id: string, answer: string) => void;
  onDelete: (id: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const answered = !!question.answer && question.answer.trim().length > 0;

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionTop}>
        <View style={styles.authorChip}>
          <Text style={styles.authorText}>{question.author || 'Attendee'}</Text>
        </View>
        <View
          style={[
            styles.statusChip,
            {
              backgroundColor: answered
                ? withAlpha(SUCCESS_GREEN, '26')
                : withAlpha(WARNING_ORANGE, '33'),
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: answered ? '#2E7D32' : '#F57C00' },
            ]}
          >
            {answered ? 'Answered' : 'Pending'}
          </Text>
        </View>
        <View style={styles.spacer} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete question"
          onPress={() => onDelete(question.id)}
          hitSlop={8}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={20}
            color={GREY_500}
          />
        </Pressable>
      </View>
      <Text style={styles.questionMessage}>{question.message}</Text>
      {answered ? (
        <View style={styles.answerBox}>
          <Text style={styles.answerText}>Answer: {question.answer}</Text>
        </View>
      ) : (
        <View style={styles.answerForm}>
          <View style={styles.answerInputRow}>
            <MaterialCommunityIcons
              name="pencil-outline"
              size={18}
              color={THEME_COLOR}
            />
            <TextInput
              style={styles.answerInput}
              placeholder="Write an answer"
              placeholderTextColor="#BDBDBD"
              value={draft}
              onChangeText={setDraft}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              if (draft.trim().length === 0) return;
              onAnswer(question.id, draft.trim());
              setDraft('');
            }}
            style={({ pressed }) => [
              styles.answerButton,
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
            <Text style={styles.answerButtonLabel}>Mark as answered</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function SummaryCard({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

export default function AdminQuestionsPage({
  questions,
  onAnswer,
  onDelete,
}: AdminQuestionsPageProps) {
  const pending = questions.filter(
    (question) => !question.answer || question.answer.trim().length === 0,
  ).length;
  const answered = questions.length - pending;

  const groups = useMemo(() => {
    const map = new Map<string, Question[]>();
    for (const question of questions) {
      const key = groupName(question);
      const list = map.get(key) ?? [];
      list.push(question);
      map.set(key, list);
    }
    return [...map.entries()].sort(([a], [b]) => {
      if (a === 'General') return 1;
      if (b === 'General') return -1;
      return a < b ? -1 : 1;
    });
  }, [questions]);

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>Questions Management</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons
              name="comment-question-outline"
              size={24}
              color={THEME_COLOR}
            />
          </View>
          <Text style={styles.infoText}>
            View incoming attendee questions and answer them without losing
            the clean ElMoultaqa layout.
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard value={pending} label="Pending" />
          <SummaryCard value={answered} label="Answered" />
          <SummaryCard value={questions.length} label="Total" />
        </View>

        {groups.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons
                name="inbox"
                size={26}
                color={THEME_COLOR}
              />
            </View>
            <Text style={styles.emptyTitle}>No stream questions available</Text>
            <Text style={styles.emptySubtitle}>
              When attendees send questions from the live stream, they will
              appear here.
            </Text>
          </View>
        ) : (
          groups.map(([group, items]) => (
            <View key={group} style={styles.group}>
              <View style={styles.groupHeader}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color={THEME_COLOR}
                />
                <Text style={styles.groupTitle} numberOfLines={1}>
                  {group}
                </Text>
                <Text style={styles.groupCount}>
                  {items.length} question{items.length === 1 ? '' : 's'}
                </Text>
              </View>
              {items.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  onAnswer={onAnswer}
                  onDelete={onDelete}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
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
  header: {
    fontSize: 22,
    fontWeight: '800',
    color: THEME_COLOR,
  },
  infoCard: {
    marginTop: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: withAlpha(THEME_COLOR, '14'),
    borderRadius: 20,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: withAlpha(THEME_COLOR, '29'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
  },
  summaryRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
    color: THEME_COLOR,
  },
  summaryLabel: {
    marginTop: 4,
    fontSize: 13,
    color: MUTED,
  },
  emptyCard: {
    marginTop: 16,
    padding: 24,
    alignItems: 'center',
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
  emptyTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '800',
    color: BODY_DARK,
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: GREY_600,
    textAlign: 'center',
    lineHeight: 18,
  },
  group: {
    marginTop: 16,
    gap: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  groupTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: THEME_COLOR,
  },
  groupCount: {
    fontSize: 12,
    color: GREY_600,
  },
  questionCard: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  questionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: withAlpha(THEME_COLOR, '1F'),
    borderRadius: 8,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  spacer: {
    flex: 1,
  },
  questionMessage: {
    marginTop: 8,
    fontSize: 15,
    color: BODY_DARK,
    lineHeight: 21,
  },
  answerBox: {
    marginTop: 10,
    width: '100%',
    padding: 12,
    backgroundColor: withAlpha(SUCCESS_GREEN, '14'),
    borderWidth: 1,
    borderColor: withAlpha(SUCCESS_GREEN, '2E'),
    borderRadius: 14,
  },
  answerText: {
    fontSize: 14,
    color: BODY_DARK,
    lineHeight: 19,
  },
  answerForm: {
    marginTop: 12,
  },
  answerInputRow: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 18,
  },
  answerInput: {
    flex: 1,
    minHeight: 56,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000000',
  },
  answerButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
  },
  answerButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
