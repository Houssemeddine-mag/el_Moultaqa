import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  DIVIDER,
  GREY_600,
  LIVE_RED,
  MUTED,
  SUCCESS_GREEN,
  THEME_COLOR,
  TITLE_DARK,
} from './theme';

type SettingsPageProps = {
  onLogout?: () => void;
};

function SettingRow({
  icon,
  title,
  subtitle,
  destructive,
  trailing,
  onPress,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  subtitle: string;
  destructive?: boolean;
  trailing?: React.ReactNode;
  onPress?: () => void;
}) {
  const color = destructive ? LIVE_RED : THEME_COLOR;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.row}
    >
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color }]}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {trailing ?? (
        <MaterialCommunityIcons name="chevron-right" size={22} color={color} />
      )}
    </Pressable>
  );
}

function DialogShell({
  icon,
  title,
  onClose,
  children,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.dialogBackdrop}>
        <View style={styles.dialog}>
          <View style={styles.dialogHeader}>
            <View style={styles.dialogTitleRow}>
              <MaterialCommunityIcons
                name={icon}
                size={24}
                color={THEME_COLOR}
              />
              <Text style={styles.dialogTitle}>{title}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={GREY_600}
              />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [dialog, setDialog] = useState<
    null | 'privacy' | 'language' | 'help' | 'cache' | 'logout'
  >(null);
  const [toast, setToast] = useState('');
  const [toastError, setToastError] = useState(false);

  function showToast(message: string, isError = false) {
    setToast(message);
    setToastError(isError);
    setTimeout(() => setToast(''), 2500);
  }

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Settings</Text>

        <View style={styles.group}>
          <SettingRow
            icon="bell-outline"
            title="Notifications"
            subtitle="Manage event alerts and reminders"
            trailing={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ true: THEME_COLOR, false: '#D1D5DB' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <View style={styles.divider} />
          <SettingRow
            icon="shield-lock-outline"
            title="Privacy & Security"
            subtitle="Control your data and privacy settings"
            onPress={() => setDialog('privacy')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="web"
            title="Language"
            subtitle="Select app language"
            onPress={() => setDialog('language')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get assistance with your conference app"
            onPress={() => setDialog('help')}
          />
        </View>

        <View style={styles.group}>
          <SettingRow
            icon="trash-can-outline"
            title="Clear Cache"
            subtitle="Free up space on your device"
            onPress={() => setDialog('cache')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="logout"
            title="Logout"
            subtitle="Sign out of your account"
            destructive
            onPress={() => setDialog('logout')}
          />
        </View>
      </ScrollView>

      {dialog === 'privacy' && (
        <DialogShell
          icon="shield-lock-outline"
          title="Privacy & Security"
          onClose={() => setDialog(null)}
        >
          <ScrollView style={styles.dialogBody}>
            <Text style={styles.docTitle}>Data Usage & Protection</Text>
            <Text style={styles.docBody}>
              We collect and store your conference registration data
              including email, name, and profile information solely to
              provide you with a seamless conference experience. This data
              is used exclusively for:
            </Text>
            {[
              'Displaying your profile and user information within the app',
              'Managing your conference registration',
              'Sending relevant event notifications and updates',
              'Enabling networking features during the conference',
            ].map((bullet) => (
              <Text key={bullet} style={styles.bullet}>
                • {bullet}
              </Text>
            ))}
            <Text style={styles.docTitle}>Data Security</Text>
            <Text style={styles.docBody}>
              Your data is securely stored and protected with encryption. We
              do not:
            </Text>
            {[
              'Share your personal data with third parties',
              'Use your data for marketing purposes',
              'Sell or trade your information',
              'Store sensitive payment information',
            ].map((bullet) => (
              <Text key={bullet} style={styles.bullet}>
                • {bullet}
              </Text>
            ))}
            <Text style={styles.docTitle}>Data Retention</Text>
            <Text style={styles.docBody}>
              Your data will be retained for the duration of the conference
              and can be deleted upon request by contacting support.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setDialog(null)}
              style={styles.dialogButton}
            >
              <Text style={styles.dialogButtonLabel}>I Understand</Text>
            </Pressable>
          </ScrollView>
        </DialogShell>
      )}

      {dialog === 'language' && (
        <DialogShell
          icon="web"
          title="Language"
          onClose={() => setDialog(null)}
        >
          <View style={styles.dialogBody}>
            {['English', 'Français', 'العربية'].map((language) => (
              <Pressable
                key={language}
                accessibilityRole="button"
                onPress={() => {
                  if (language !== 'English') {
                    showToast(`${language} — coming soon`);
                  }
                  setDialog(null);
                }}
                style={styles.languageRow}
              >
                <View
                  style={[
                    styles.radio,
                    language === 'English' && styles.radioActive,
                  ]}
                >
                  {language === 'English' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.languageLabel}>{language}</Text>
              </Pressable>
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => setDialog(null)}
            >
              <Text style={styles.dialogAction}>Close</Text>
            </Pressable>
          </View>
        </DialogShell>
      )}

      {dialog === 'help' && (
        <DialogShell
          icon="help-circle-outline"
          title="Help & Support"
          onClose={() => setDialog(null)}
        >
          <View style={styles.dialogBody}>
            <Text style={styles.docBody}>
              Need assistance?{'\n\n'}• Contact your conference organizer for
              access issues.{'\n'}• For technical support, email
              support@elmoultaqa.com.{'\n'}• Check the conference website for
              FAQs.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setDialog(null)}
            >
              <Text style={styles.dialogAction}>Close</Text>
            </Pressable>
          </View>
        </DialogShell>
      )}

      {dialog === 'cache' && (
        <DialogShell
          icon="trash-can-outline"
          title="Clear Cache"
          onClose={() => setDialog(null)}
        >
          <View style={styles.dialogBody}>
            <Text style={styles.confirmBody}>
              This will clear cached conference data (schedules,
              notifications). You will stay signed in.
            </Text>
            <View style={styles.confirmRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDialog(null)}
              >
                <Text style={styles.cancelAction}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setDialog(null);
                  showToast('Cache cleared');
                }}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmLabel}>Clear</Text>
              </Pressable>
            </View>
          </View>
        </DialogShell>
      )}

      {dialog === 'logout' && (
        <DialogShell icon="logout" title="Logout" onClose={() => setDialog(null)}>
          <View style={styles.dialogBody}>
            <Text style={styles.confirmBody}>
              Are you sure you want to logout from your account?
            </Text>
            <View style={styles.confirmRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setDialog(null)}
              >
                <Text style={styles.cancelAction}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setDialog(null);
                  onLogout?.();
                }}
                style={styles.confirmButton}
              >
                <Text style={styles.confirmLabel}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </DialogShell>
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
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  group: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  rowSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: MUTED,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    backgroundColor: DIVIDER,
  },
  dialogBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '80%',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  dialogBody: {
    marginTop: 16,
  },
  docTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: TITLE_DARK,
  },
  docBody: {
    marginTop: 8,
    fontSize: 14,
    color: MUTED,
    lineHeight: 22,
  },
  bullet: {
    marginTop: 8,
    fontSize: 14,
    color: MUTED,
    lineHeight: 21,
  },
  dialogButton: {
    marginTop: 24,
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: THEME_COLOR,
    borderRadius: 12,
  },
  dialogButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  languageRow: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: THEME_COLOR,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME_COLOR,
  },
  languageLabel: {
    fontSize: 15,
    color: TITLE_DARK,
  },
  dialogAction: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
    color: THEME_COLOR,
    textAlign: 'right',
  },
  confirmBody: {
    fontSize: 16,
    color: TITLE_DARK,
    lineHeight: 24,
  },
  confirmRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
  },
  cancelAction: {
    fontSize: 15,
    color: GREY_600,
  },
  confirmButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: THEME_COLOR,
    borderRadius: 8,
  },
  confirmLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
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
