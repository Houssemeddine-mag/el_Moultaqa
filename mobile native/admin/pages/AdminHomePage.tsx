import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import {
  BODY_DARK,
  GREY_400,
  GREY_500,
  LIVE_RED,
  THEME_COLOR,
  WARNING_ORANGE,
  withAlpha,
} from '../../pages/theme';
import { MOCK_CONFERENCE, NotificationItem, Question } from '../../pages/mock';

type AdminHomePageProps = {
  notifications: NotificationItem[];
  questions: Question[];
  onOpenProgram: () => void;
  onOpenNotifications: () => void;
  onOpenQuestions: () => void;
};

function HeaderStat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.headerStat}>
      <View style={styles.headerStatTop}>
        <MaterialCommunityIcons
          name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={14}
          color="rgba(255,255,255,0.7)"
        />
        <Text style={styles.headerStatValue}>{value}</Text>
      </View>
      <Text style={styles.headerStatLabel}>{label}</Text>
    </View>
  );
}

function ActionTile({
  icon,
  title,
  subtitle,
  badge,
  badgeColor,
  onPress,
}: {
  icon: string;
  title: string;
  subtitle: string;
  badge?: number;
  badgeColor?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <View style={styles.tileIcon}>
        <MaterialCommunityIcons
          name={icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
          size={22}
          color={THEME_COLOR}
        />
      </View>
      <View style={styles.tileText}>
        <Text style={styles.tileTitle}>{title}</Text>
        <Text style={styles.tileSubtitle}>{subtitle}</Text>
      </View>
      {badge !== undefined && badge > 0 && (
        <View
          style={[styles.badge, { backgroundColor: withAlpha(badgeColor ?? LIVE_RED, '1A') }]}
        >
          <Text style={[styles.badgeText, { color: badgeColor ?? LIVE_RED }]}>
            {badge}
          </Text>
        </View>
      )}
      <MaterialCommunityIcons name="chevron-right" size={20} color={GREY_400} />
    </Pressable>
  );
}

export default function AdminHomePage({
  notifications,
  questions,
  onOpenProgram,
  onOpenNotifications,
  onOpenQuestions,
}: AdminHomePageProps) {
  const pending = questions.filter((question) => !question.answer).length;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[THEME_COLOR, withAlpha(THEME_COLOR, 'CC')]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="shield-account"
              size={24}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {MOCK_CONFERENCE.name} Admin
            </Text>
            <Text style={styles.headerSubtitle}>Manage your conference</Text>
          </View>
        </View>
        <View style={styles.headerStats}>
          <HeaderStat
            icon="bell-ring-outline"
            value={notifications.length}
            label="Notifications"
          />
          <HeaderStat
            icon="comment-question-outline"
            value={questions.length}
            label="Questions"
          />
          <HeaderStat icon="clock-outline" value={pending} label="Pending" />
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.tiles}>
        <ActionTile
          icon="calendar-month-outline"
          title="Program"
          subtitle="Review the conference schedule and sessions"
          onPress={onOpenProgram}
        />
        <ActionTile
          icon="bell-ring-outline"
          title="Notifications"
          subtitle="Create, publish, and delete notifications"
          badge={notifications.length}
          badgeColor={LIVE_RED}
          onPress={onOpenNotifications}
        />
        <ActionTile
          icon="comment-question-outline"
          title="Questions"
          subtitle="Review and answer incoming stream questions"
          badge={pending}
          badgeColor={WARNING_ORANGE}
          onPress={onOpenQuestions}
        />
      </View>
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
    opacity: 0.75,
  },
  header: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    elevation: 6,
    shadowColor: THEME_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  headerStats: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 24,
  },
  headerStat: {
    flex: 1,
  },
  headerStatTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerStatValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerStatLabel: {
    marginTop: 2,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  tiles: {
    marginTop: 12,
    gap: 10,
  },
  tile: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    flex: 1,
  },
  tileTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: BODY_DARK,
  },
  tileSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: GREY_500,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
