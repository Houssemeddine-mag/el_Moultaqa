import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { GREY_500, THEME_COLOR, withAlpha } from '../pages/theme';

export const ADMIN_DRAWER_ITEMS = [
  { icon: 'home-outline', label: 'Home' },
  { icon: 'calendar-month-outline', label: 'Program' },
  { icon: 'bell-ring-outline', label: 'Notifications' },
  { icon: 'comment-question-outline', label: 'Questions' },
] as const;

type AdminDrawerProps = {
  selectedIndex: number;
  onSelect: (index: number) => void;
  onExit: () => void;
};

const adminLogo = require('../assets/icons/icon.png');

export default function AdminDrawer({
  selectedIndex,
  onSelect,
  onExit,
}: AdminDrawerProps) {
  return (
    <View style={styles.drawer}>
      <LinearGradient
        colors={[THEME_COLOR, '#1FB69A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Image source={adminLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Admin Panel</Text>
      </LinearGradient>

      <View style={styles.items}>
        {ADMIN_DRAWER_ITEMS.map((item, index) => {
          const selected = index === selectedIndex;
          return (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              onPress={() => onSelect(index)}
              style={[styles.item, selected && styles.itemSelected]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={selected ? THEME_COLOR : GREY_500}
              />
              <Text style={[styles.itemLabel, selected && styles.itemLabelSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.footer}>
        <View style={styles.divider} />
        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL('https://elmoultaqa.com')}
          style={styles.item}
        >
          <MaterialCommunityIcons name="web" size={24} color={THEME_COLOR} />
          <Text style={styles.webappLabel}>Visit WebApp</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onExit}
          style={styles.item}
        >
          <MaterialCommunityIcons name="logout" size={24} color={THEME_COLOR} />
          <Text style={styles.webappLabel}>Exit panel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  header: {
    height: 160,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 72,
    height: 72,
  },
  headerTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  items: {
    flex: 1,
    paddingTop: 8,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemSelected: {
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
  },
  itemLabel: {
    fontSize: 15,
    color: GREY_500,
  },
  itemLabelSelected: {
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  footer: {
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  webappLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME_COLOR,
  },
});
