import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { GREY_500, THEME_COLOR, withAlpha } from './theme';

export const DRAWER_ITEMS = [
  { icon: 'home-outline', label: 'Home' },
  { icon: 'calendar-month-outline', label: 'Program' },
  { icon: 'video-outline', label: 'Live Stream' },
  { icon: 'account-outline', label: 'Profile' },
  { icon: 'cog-outline', label: 'Settings' },
] as const;

type AppDrawerProps = {
  selectedIndex: number;
  conferenceName?: string;
  onSelect: (index: number) => void;
};

const drawerLogo = require('../assets/images/logo.png');

export default function AppDrawer({
  selectedIndex,
  conferenceName = 'ElMoultaqa',
  onSelect,
}: AppDrawerProps) {
  return (
    <View style={styles.drawer}>
      <LinearGradient
        colors={[THEME_COLOR, '#1FB69A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Image source={drawerLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.conferenceName} numberOfLines={1}>
          {conferenceName}
        </Text>
      </LinearGradient>

      <View style={styles.items}>
        {DRAWER_ITEMS.slice(0, 4).map((item, index) => {
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

      <View style={styles.divider} />

      <Pressable
        accessibilityRole="button"
        onPress={() => onSelect(4)}
        style={[styles.item, selectedIndex === 4 && styles.itemSelected]}
      >
        <MaterialCommunityIcons
          name="cog-outline"
          size={24}
          color={selectedIndex === 4 ? THEME_COLOR : GREY_500}
        />
        <Text
          style={[
            styles.itemLabel,
            selectedIndex === 4 && styles.itemLabelSelected,
          ]}
        >
          Settings
        </Text>
      </Pressable>

      <View style={styles.spacer} />

      <View style={styles.divider} />

      <Pressable
        accessibilityRole="link"
        onPress={() => Linking.openURL('https://elmoultaqa.com')}
        style={styles.item}
      >
        <MaterialCommunityIcons name="web" size={24} color={THEME_COLOR} />
        <Text style={styles.webappLabel}>Visit WebApp</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  header: {
    paddingTop: 48,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  conferenceName: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  items: {
    paddingTop: 8,
  },
  spacer: {
    flex: 1,
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
