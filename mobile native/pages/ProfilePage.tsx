import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  FEMALE_PINK,
  GREY_500,
  GREY_600,
  MALE_BLUE,
  MUTED,
  SUCCESS_GREEN,
  THEME_COLOR,
  TITLE_DARK,
  WARNING_ORANGE,
  getInitials,
  withAlpha,
} from './theme';
import {
  COUNTRIES,
  GENDERS,
  MOCK_PROFILE,
  PROVINCES,
  SCHOOL_LEVELS,
  UserProfile,
} from './mock';

type ProfilePageProps = {
  initialProfile?: UserProfile;
  onSaved?: (profile: UserProfile) => void;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function OptionSheet({
  title,
  options,
  onPick,
  onClose,
}: {
  title: string;
  options: string[];
  onPick: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{title}</Text>
          {options.map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => {
                onPick(option);
                onClose();
              }}
              style={styles.sheetOption}
            >
              <Text style={styles.sheetOptionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

export default function ProfilePage({
  initialProfile = MOCK_PROFILE,
  onSaved,
}: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [sheet, setSheet] = useState<
    null | 'photo' | 'school' | 'gender' | 'country' | 'province'
  >(null);
  const [toast, setToast] = useState('');
  const [toastError, setToastError] = useState(false);

  function showToast(message: string, isError = false) {
    setToast(message);
    setToastError(isError);
    setTimeout(() => setToast(''), 2500);
  }

  const complete = profile.organization.trim().length > 0;
  const avatarBorder =
    draft.gender === 'Male'
      ? MALE_BLUE
      : draft.gender === 'Female'
        ? FEMALE_PINK
        : THEME_COLOR;
  const shown = editing ? draft : profile;

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setProfile(draft);
      setEditing(false);
      setSaving(false);
      onSaved?.(draft);
      showToast('Profile updated successfully!');
    }, 600);
  }

  function handleCancel() {
    setDraft(profile);
    setEditing(false);
  }

  const infoRows: Array<[string, string]> = [
    ['Organization', shown.organization],
    ['Education Level', shown.schoolLevel],
    ['Gender', shown.gender],
    ['Birthday', shown.birthday],
    ['Country', shown.country],
    ['Province', shown.province],
  ];
  const hasInfo = infoRows.some(([, value]) => value.trim().length > 0);

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>My Profile</Text>

        <View style={styles.card}>
          <Pressable
            accessibilityRole="button"
            disabled={!editing}
            onPress={() => setSheet('photo')}
            style={styles.avatarWrap}
          >
            <View style={[styles.avatar, { borderColor: avatarBorder }]}>
              <Text style={styles.avatarInitials}>
                {getInitials(shown.name || 'Conference User')}
              </Text>
            </View>
            {editing && (
              <View style={styles.cameraBadge}>
                <MaterialCommunityIcons
                  name="camera"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
            )}
          </Pressable>
          <Text style={styles.name}>{shown.name || 'Conference User'}</Text>
          <Text style={styles.email}>
            {shown.email || 'user@conference.com'}
          </Text>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: complete ? SUCCESS_GREEN : WARNING_ORANGE },
            ]}
          >
            <Text style={styles.statusText}>
              {complete ? 'Profile Complete' : 'Profile Incomplete'}
            </Text>
          </View>
          {!editing ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setDraft(profile);
                setEditing(true);
              }}
              style={({ pressed }) => [
                styles.editButton,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons name="pencil" size={18} color="#FFFFFF" />
              <Text style={styles.editLabel}>Edit Profile</Text>
            </Pressable>
          ) : (
            <View style={styles.editRow}>
              <Pressable
                accessibilityRole="button"
                onPress={handleSave}
                disabled={saving}
                style={[styles.saveButton, saving && styles.pressed]}
              >
                <Text style={styles.editLabel}>
                  {saving ? 'Saving...' : 'Save'}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleCancel}
                style={styles.cancelButton}
              >
                <Text style={styles.editLabel}>Cancel</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Additional Information</Text>
          {!editing ? (
            !hasInfo ? (
              <Text style={styles.emptyText}>
                No additional information added yet. Click &quot;Edit
                Profile&quot; to add details.
              </Text>
            ) : (
              <View style={styles.infoList}>
                {infoRows
                  .filter(([, value]) => value.trim().length > 0)
                  .map(([label, value]) => (
                    <View key={label} style={styles.infoRow}>
                      <Text style={styles.infoLabel}>{label}</Text>
                      <Text style={styles.infoValue}>{value}</Text>
                    </View>
                  ))}
              </View>
            )
          ) : (
            <View style={styles.formList}>
              <Field label="Organization">
                <TextInput
                  style={styles.input}
                  value={draft.organization}
                  onChangeText={(value) =>
                    setDraft({ ...draft, organization: value })
                  }
                  placeholder="Your organization"
                  placeholderTextColor={GREY_500}
                />
              </Field>
              <Field label="Education Level">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setSheet('school')}
                  style={styles.select}
                >
                  <Text
                    style={
                      draft.schoolLevel
                        ? styles.selectValue
                        : styles.selectPlaceholder
                    }
                  >
                    {draft.schoolLevel || 'Select level'}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={GREY_500}
                  />
                </Pressable>
              </Field>
              <Field label="Gender">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setSheet('gender')}
                  style={styles.select}
                >
                  <Text
                    style={
                      draft.gender ? styles.selectValue : styles.selectPlaceholder
                    }
                  >
                    {draft.gender || 'Select gender'}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={GREY_500}
                  />
                </Pressable>
              </Field>
              <Field label="Birthday">
                <View style={styles.select}>
                  <Text
                    style={
                      draft.birthday
                        ? styles.selectValue
                        : styles.selectPlaceholder
                    }
                  >
                    {draft.birthday || 'Select Birthday'}
                  </Text>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={20}
                    color={THEME_COLOR}
                  />
                </View>
              </Field>
              <Field label="Country">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setSheet('country')}
                  style={styles.select}
                >
                  <Text
                    style={
                      draft.country
                        ? styles.selectValue
                        : styles.selectPlaceholder
                    }
                  >
                    {draft.country || 'Select country'}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={GREY_500}
                  />
                </Pressable>
              </Field>
              {draft.country === 'Algeria' && (
                <Field label="Province/Wilaya">
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setSheet('province')}
                    style={styles.select}
                  >
                    <Text
                      style={
                        draft.province
                          ? styles.selectValue
                          : styles.selectPlaceholder
                      }
                    >
                      {draft.province || 'Select province'}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color={GREY_500}
                    />
                  </Pressable>
                </Field>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {sheet === 'photo' && (
        <Modal transparent animationType="slide" onRequestClose={() => setSheet(null)}>
          <Pressable
            style={styles.sheetBackdrop}
            onPress={() => setSheet(null)}
          >
            <View style={styles.photoSheet}>
              <Text style={styles.sheetTitle}>Update Profile Picture</Text>
              <View style={styles.photoRow}>
                {(
                  [
                    { icon: 'camera', label: 'Camera' },
                    { icon: 'image', label: 'Gallery' },
                  ] as const
                ).map((option) => (
                  <Pressable
                    key={option.label}
                    accessibilityRole="button"
                    onPress={() => {
                      setSheet(null);
                      showToast('Profile picture updated!');
                    }}
                    style={styles.photoOption}
                  >
                    <View style={styles.photoBox}>
                      <MaterialCommunityIcons
                        name={option.icon}
                        size={30}
                        color={THEME_COLOR}
                      />
                    </View>
                    <Text style={styles.photoLabel}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
      {sheet === 'school' && (
        <OptionSheet
          title="Education Level"
          options={SCHOOL_LEVELS}
          onPick={(value) => setDraft({ ...draft, schoolLevel: value })}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === 'gender' && (
        <OptionSheet
          title="Gender"
          options={GENDERS}
          onPick={(value) => setDraft({ ...draft, gender: value })}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === 'country' && (
        <OptionSheet
          title="Country"
          options={COUNTRIES}
          onPick={(value) =>
            setDraft({
              ...draft,
              country: value,
              province: value === 'Algeria' ? draft.province : '',
            })
          }
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === 'province' && (
        <OptionSheet
          title="Province/Wilaya"
          options={PROVINCES}
          onPick={(value) => setDraft({ ...draft, province: value })}
          onClose={() => setSheet(null)}
        />
      )}

      {toast.length > 0 && (
        <View
          style={[
            styles.toast,
            { backgroundColor: toastError ? '#B91C1C' : SUCCESS_GREEN },
          ]}
        >
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
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 24,
  },
  pressed: {
    opacity: 0.7,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  card: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarWrap: {
    alignSelf: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    backgroundColor: THEME_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: THEME_COLOR,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  email: {
    marginTop: 8,
    fontSize: 16,
    color: GREY_600,
    textAlign: 'center',
  },
  statusPill: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME_COLOR,
    borderRadius: 8,
  },
  editLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editRow: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: SUCCESS_GREEN,
    borderRadius: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: GREY_500,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 14,
    color: GREY_600,
    lineHeight: 20,
  },
  infoList: {
    marginTop: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: MUTED,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  formList: {
    marginTop: 16,
    gap: 16,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLOR,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  select: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  selectValue: {
    fontSize: 15,
    color: '#000000',
  },
  selectPlaceholder: {
    fontSize: 15,
    color: GREY_500,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: TITLE_DARK,
    textAlign: 'center',
  },
  sheetOption: {
    marginTop: 4,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sheetOptionText: {
    fontSize: 16,
    color: TITLE_DARK,
    textAlign: 'center',
  },
  photoSheet: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  photoRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  photoOption: {
    alignItems: 'center',
    gap: 8,
  },
  photoBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: withAlpha(THEME_COLOR, '1A'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: TITLE_DARK,
  },
  toast: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  toastText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
