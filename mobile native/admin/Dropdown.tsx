import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { GREY_500, THEME_COLOR } from '../pages/theme';

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  label: string;
  value: string;
  options: DropdownOption[];
  onPick: (value: string) => void;
};

export default function Dropdown({ label, value, options, onPick }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <>
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setOpen(true)}
          style={styles.select}
        >
          <Text style={styles.selectValue} numberOfLines={1}>
            {selected?.label ?? 'None'}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={GREY_500}
          />
        </Pressable>
      </View>
      {open && (
        <Modal transparent animationType="fade" onRequestClose={() => setOpen(false)}>
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{label}</Text>
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    onPress={() => {
                      onPick(option.value);
                      setOpen(false);
                    }}
                    style={[styles.option, active && styles.optionActive]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        active && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME_COLOR,
  },
  select: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
  },
  selectValue: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    padding: 20,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
  },
  option: {
    marginTop: 4,
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  optionActive: {
    backgroundColor: '#E8F5EE',
  },
  optionText: {
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
  },
  optionTextActive: {
    fontWeight: '700',
    color: THEME_COLOR,
  },
});
