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

type RegisterScreenProps = {
  appName?: string;
  themeColor?: string;
  onSignUp?: (name: string, email: string, password: string) => void;
  onGoLogin?: () => void;
};

const flutterLogo = require('../assets/images/logo.png');

export default function RegisterScreen({
  appName = 'ElMoultaqa',
  themeColor = DEFAULT_THEME_COLOR,
  onSignUp,
  onGoLogin,
}: RegisterScreenProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState('');

  function focusStyle(key: string) {
    return focused === key
      ? { borderColor: themeColor, backgroundColor: '#FFFFFF' }
      : undefined;
  }

  function handleSignUp() {
    if (name.trim().length === 0) {
      setError('Please enter your full name.');
      return;
    }
    if (email.trim().length === 0) {
      setError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (confirm !== password) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    onSignUp?.(name.trim(), email.trim(), password);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <View
            style={[
              styles.logoWrap,
              { backgroundColor: withAlpha(themeColor, '1A') },
            ]}
          >
            {logoFailed ? (
              <Text style={[styles.logoFallback, { color: themeColor }]}>
                {appName.slice(0, 1).toUpperCase()}
              </Text>
            ) : (
              <Image
                source={flutterLogo}
                style={styles.logo}
                onError={() => setLogoFailed(true)}
              />
            )}
          </View>

          <Text style={styles.welcome}>Create your account on</Text>
          <Text style={[styles.appName, { color: themeColor }]}>{appName}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={[styles.input, focusStyle('name')]}
              placeholder="Your full name"
              placeholderTextColor="#A3A3A3"
              value={name}
              onChangeText={(value) => {
                setName(value);
                if (error) setError('');
              }}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, focusStyle('email')]}
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
            <View style={[styles.input, styles.passwordRow, focusStyle('password')]}>
              <TextInput
                style={styles.passwordInput}
                placeholder="At least 6 characters"
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
                returnKeyType="next"
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

            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={[styles.input, focusStyle('confirm')]}
              placeholder="Repeat your password"
              placeholderTextColor="#A3A3A3"
              value={confirm}
              onChangeText={(value) => {
                setConfirm(value);
                if (error) setError('');
              }}
              onFocus={() => setFocused('confirm')}
              onBlur={() => setFocused(null)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />

            {error.length > 0 && <Text style={styles.error}>{error}</Text>}

            <Pressable
              accessibilityRole="button"
              onPress={handleSignUp}
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: themeColor },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryLabel}>Sign up</Text>
            </Pressable>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Pressable accessibilityRole="button" onPress={onGoLogin}>
              <Text style={[styles.switchLink, { color: themeColor }]}>
                Sign in
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
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoFallback: {
    fontSize: 36,
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
  terms: {
    marginTop: 24,
    fontSize: 12,
    color: '#A3A3A3',
    textAlign: 'center',
  },
});
