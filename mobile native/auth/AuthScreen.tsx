import { useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DEFAULT_THEME_COLOR, isValidEmail, withAlpha } from './theme';
import { GithubIcon, GoogleIcon } from './BrandIcons';

type AuthScreenProps = {
  appName?: string;
  logoUrl?: string;
  themeColor?: string;
  onSignIn?: (email: string, password: string) => void;
  onGooglePress?: () => void;
  onGithubPress?: () => void;
  onGoRegister?: () => void;
  onGoAdminLogin?: () => void;
};

// Brand logo carried over from the Flutter app (Mobile/assets/images/logo.png).
const flutterLogo = require('../assets/images/logo.png');

export default function AuthScreen({
  appName = 'ElMoultaqa',
  logoUrl = '',
  themeColor = DEFAULT_THEME_COLOR,
  onSignIn,
  onGooglePress,
  onGithubPress,
  onGoRegister,
  onGoAdminLogin,
}: AuthScreenProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  // Dev test credentials (no backend yet).
  const [email, setEmail] = useState('test');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<'email' | 'password' | null>(null);
  const [error, setError] = useState('');

  const showRemoteLogo = logoUrl.length > 0 && !logoFailed;

  function handleSignIn() {
    if (email.trim().length === 0) {
      setError('Please enter your email address.');
      return;
    }
    // Dev bypass (user side only): test + 123456 always passes.
    // test1 is admin-only and is rejected here (not a valid email).
    const isTestCreds = email.trim() === 'test' && password === '123456';
    if (!isTestCreds && !isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length === 0) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    onSignIn?.(email.trim(), password);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          {showRemoteLogo ? (
            <Image
              source={{ uri: logoUrl }}
              style={styles.logo}
              resizeMode="contain"
              onError={() => setLogoFailed(true)}
            />
          ) : logoFailed ? (
            <Text style={[styles.logoFallback, { color: themeColor }]}>
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

          <Text style={styles.welcome}>Welcome back to</Text>
          <Text style={[styles.appName, { color: themeColor }]}>{appName}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                focused === 'email' && {
                  borderColor: themeColor,
                  backgroundColor: '#FFFFFF',
                },
              ]}
              placeholder="you@example.com"
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
            />

            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.input,
                styles.passwordRow,
                focused === 'password' && {
                  borderColor: themeColor,
                  backgroundColor: '#FFFFFF',
                },
              ]}
            >
              <TextInput
                style={styles.passwordInput}
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

            {error.length > 0 && <Text style={styles.error}>{error}</Text>}

            <Pressable
              accessibilityRole="button"
              onPress={handleSignIn}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: themeColor },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryLabel}>Sign in</Text>
            </Pressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socials}>
            <Pressable
              accessibilityRole="button"
              onPress={onGooglePress}
              style={({ pressed }) => [
                styles.socialButton,
                { borderColor: withAlpha(themeColor, '4D') },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.brandIcon}>
                <GoogleIcon size={22} />
              </View>
              <Text style={styles.socialLabel}>Google</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={onGithubPress}
              style={({ pressed }) => [
                styles.socialButton,
                { borderColor: withAlpha(themeColor, '4D') },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.brandIcon}>
                <GithubIcon size={22} />
              </View>
              <Text style={styles.socialLabel}>GitHub</Text>
            </Pressable>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don&apos;t have an account? </Text>
            <Pressable accessibilityRole="button" onPress={onGoRegister}>
              <Text style={[styles.switchLink, { color: themeColor }]}>
                Sign up
              </Text>
            </Pressable>
          </View>

          <View style={styles.adminLinkRow}>
            <Text style={styles.switchText}>Are you an administrator? </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Login as administrator"
              onPress={onGoAdminLogin}
            >
              <Text style={[styles.switchLink, { color: themeColor }]}>
                Login here
              </Text>
            </Pressable>
          </View>

          <Text style={styles.terms}>
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoFallback: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  welcome: {
    marginTop: 24,
    fontSize: 14,
    color: '#737373',
  },
  appName: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    marginTop: 32,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#404040',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1F1F1F',
    backgroundColor: '#FAFAFA',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  passwordInput: {
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
  error: {
    marginTop: 12,
    fontSize: 13,
    color: '#DC2626',
  },
  primaryButton: {
    marginTop: 24,
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.7,
  },
  dividerRow: {
    marginTop: 28,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  socials: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
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
  switchRow: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: '#737373',
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  adminLinkRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  terms: {
    marginTop: 24,
    fontSize: 12,
    color: '#A3A3A3',
    textAlign: 'center',
  },
});
