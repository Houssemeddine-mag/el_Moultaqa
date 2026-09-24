import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { DEFAULT_THEME_COLOR, isValidEmail } from './theme';
import { GoogleIcon } from './BrandIcons';

type AdminLoginScreenProps = {
  appName?: string;
  themeColor?: string;
  onAdminSignIn?: (email: string, password: string) => void;
  onGooglePress?: () => void;
  onGoBack?: () => void;
};

const flutterLogo = require('../assets/images/logo.png');

// Module-level: the entrance stagger runs once per app session.
let adminEntrancePlayed = false;

// Admin console: reversed color scheme vs. the white attendee login.
// Dark green-black page, white logo card (logo itself carries a black
// background, so it reads as an inverted badge on the dark surface).
const PAGE_BG = '#0B1F1A';
const PAGE_BG_END = '#143E33';
const MUTED_ON_DARK = '#A7B8B1';

const PERKS = [
  { icon: 'calendar-month-outline', label: 'Program' },
  { icon: 'microphone-outline', label: 'Speakers' },
  { icon: 'bell-ring-outline', label: 'Notifications' },
] as const;

export default function AdminLoginScreen({
  appName = 'ElMoultaqa',
  themeColor = DEFAULT_THEME_COLOR,
  onAdminSignIn,
  onGooglePress,
  onGoBack,
}: AdminLoginScreenProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<'email' | 'password' | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Staggered entrance: header fades down first, form card rises after.
  // Plays only on the first-ever mount. App remounts this screen as the
  // exiting overlay during back navigation — replaying the entrance
  // there would fade content IN while the overlay fades OUT (glitch).
  const headerOpacity = useRef(
    new Animated.Value(adminEntrancePlayed ? 1 : 0),
  ).current;
  const headerSlide = useRef(
    new Animated.Value(adminEntrancePlayed ? 0 : -14),
  ).current;
  const cardOpacity = useRef(
    new Animated.Value(adminEntrancePlayed ? 1 : 0),
  ).current;
  const cardSlide = useRef(
    new Animated.Value(adminEntrancePlayed ? 0 : 28),
  ).current;

  useEffect(() => {
    if (adminEntrancePlayed) return;
    adminEntrancePlayed = true;
    Animated.stagger(130, [
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [headerOpacity, headerSlide, cardOpacity, cardSlide]);

  function handleSignIn() {
    if (submitting) return;
    if (email.trim().length === 0) {
      setError('Please enter your admin email address.');
      return;
    }
    // Dev bypass: test1 + 123456 always passes (mirrors attendee login).
    const isTestCreds = email.trim() === 'test1' && password === '123456';
    if (!isTestCreds && !isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length === 0) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    setSubmitting(true);
    // Brief delay so the loading state reads; replace with real auth later.
    setTimeout(() => {
      setSubmitting(false);
      onAdminSignIn?.(email.trim(), password);
    }, 600);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={[PAGE_BG, PAGE_BG_END]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to user login"
              onPress={onGoBack}
              hitSlop={12}
              style={({ pressed }) => [
                styles.backRow,
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={18}
                color={MUTED_ON_DARK}
              />
              <Text style={styles.backLabel}>User login</Text>
            </Pressable>

            <Animated.View
              style={[
                styles.header,
                {
                  opacity: headerOpacity,
                  transform: [{ translateY: headerSlide }],
                },
              ]}
            >
              {logoFailed ? (
                <Text style={styles.logoFallback}>
                  {appName.slice(0, 1).toUpperCase()}
                </Text>
              ) : (
                <Image
                  source={flutterLogo}
                  style={styles.logo}
                  resizeMode="contain"
                  onError={() => setLogoFailed(true)}
                />
              )}

              <Text style={styles.title}>Welcome back, Admin</Text>
              <Text style={styles.subtitle}>
                Sign in to manage conferences, programs, speakers and live
                updates — all from one secure dashboard.
              </Text>

              <View style={styles.perksRow}>
                {PERKS.map((perk) => (
                  <View key={perk.label} style={styles.perkPill}>
                    <MaterialCommunityIcons
                      name={perk.icon}
                      size={14}
                      color="#FFFFFF"
                    />
                    <Text style={styles.perkLabel}>{perk.label}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            <Animated.View
              style={[
                styles.formCard,
                {
                  opacity: cardOpacity,
                  transform: [{ translateY: cardSlide }],
                },
              ]}
            >
              <View style={styles.formHeader}>
                <View
                  style={[
                    styles.formIcon,
                    { backgroundColor: `${themeColor}1A` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={18}
                    color={themeColor}
                  />
                </View>
                <View style={styles.formHeaderText}>
                  <Text style={styles.formTitle}>Sign in to dashboard</Text>
                  <Text style={styles.formSubtitle}>
                    Authorized organizers only
                  </Text>
                </View>
              </View>

              <Text style={styles.label}>Admin email</Text>
              <View
                style={[
                  styles.inputRow,
                  focused === 'email' && {
                    borderColor: themeColor,
                    backgroundColor: '#FFFFFF',
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={18}
                  color={focused === 'email' ? themeColor : '#9CA3AF'}
                />
                <TextInput
                  style={styles.rowInput}
                  placeholder="admin@example.com"
                  placeholderTextColor="#A3A3A3"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (error) setError('');
                  }}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  editable={!submitting}
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputRow,
                  focused === 'password' && {
                    borderColor: themeColor,
                    backgroundColor: '#FFFFFF',
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={18}
                  color={focused === 'password' ? themeColor : '#9CA3AF'}
                />
                <TextInput
                  style={styles.rowInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#A3A3A3"
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    if (error) setError('');
                  }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                  editable={!submitting}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setShowPassword((visible) => !visible)}
                  hitSlop={12}
                >
                  <Text style={[styles.toggle, { color: themeColor }]}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>

              {error.length > 0 && (
                <View style={styles.errorBox}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={16}
                    color="#DC2626"
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Pressable
                accessibilityRole="button"
                onPress={handleSignIn}
                disabled={submitting}
                style={({ pressed }) => [
                  styles.primaryButton,
                  { backgroundColor: themeColor },
                  pressed && !submitting && styles.pressed,
                  submitting && styles.disabled,
                ]}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialCommunityIcons
                    name="view-dashboard-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                )}
                <Text style={styles.primaryLabel}>
                  {submitting ? 'Signing in…' : 'Open dashboard'}
                </Text>
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Continue with Google"
                onPress={onGooglePress}
                style={({ pressed }) => [
                  styles.socialButton,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.brandIcon}>
                  <GoogleIcon size={22} />
                </View>
                <Text style={styles.socialLabel}>Google</Text>
              </Pressable>

              <View style={styles.secureRow}>
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={14}
                  color="#6B7280"
                />
                <Text style={styles.secureLabel}>
                  Protected area · Sessions are monitored
                </Text>
              </View>
            </Animated.View>

            <Text style={styles.footer}>
              {appName} · Conference management
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PAGE_BG,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  inner: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.85,
  },
  backRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  backLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED_ON_DARK,
  },
  header: {
    width: '100%',
    alignItems: 'center',
  },
  // Reversed artwork: white silhouette of the logo for the dark console.
  // (The PNG background is transparent, so tintColor only whitens the mark.)
  logo: {
    marginTop: 10,
    width: 120,
    height: 120,
    tintColor: '#FFFFFF',
  },
  logoFallback: {
    marginTop: 10,
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: MUTED_ON_DARK,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 12,
  },
  perksRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
  },
  perkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
  },
  perkLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formCard: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  formIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formHeaderText: {
    flex: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
  },
  formSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    marginTop: 18,
    letterSpacing: 0.2,
  },
  inputRow: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F9FAFB',
  },
  rowInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1F1F1F',
  },
  toggle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  errorBox: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#DC2626',
  },
  primaryButton: {
    marginTop: 22,
    width: '100%',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#0D7E52',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dividerRow: {
    marginTop: 22,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  socialButton: {
    marginTop: 14,
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
  },
  socialLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F1F1F',
  },
  brandIcon: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secureRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secureLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: MUTED_ON_DARK,
    textAlign: 'center',
  },
});
