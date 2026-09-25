import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, useAuth, useSSO, useUser } from '@clerk/expo';
import { useSignIn, useSignUp } from '@clerk/expo/legacy';
import { tokenCache } from '@clerk/expo/token-cache';
import * as WebBrowser from 'expo-web-browser';

import AuthScreen from './auth/AuthScreen';
import RegisterScreen from './auth/RegisterScreen';
import AdminLoginScreen from './auth/AdminLoginScreen';
import DiscoveryLayout from './pages/DiscoveryLayout';
import ConferenceDetailPage from './pages/ConferenceDetailPage';
import { DiscoveryEvent } from './pages/DiscoveryPage';
import {
  loadAlertsSeenAt,
  loadMyConferences,
  loadSavedSlugs,
  saveAlertsSeenAt,
  saveMyConferences,
  saveSavedSlugs,
} from './pages/discovery/storage';
import type { AlertItem } from './pages/discovery/types';
import { toAlertItem } from './pages/discovery/utils';
import ClerkBridge from './auth/ClerkBridge';
import MainLayout from './pages/MainLayout';
import AdminLayout from './admin/AdminLayout';
import OrgGate from './pages/OrgGate';
import SupabaseService from './services/supabase';

WebBrowser.maybeCompleteAuthSession();

const bootLogo = require('./assets/images/logo.png');
const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

// Slide-over transition between the auth screens (user login <->
// register <-> admin login). The incoming screen mounts on top as a
// fully opaque sheet and glides in from the screen edge over ~600ms
// with the Material emphasized easing. The old screen sits static
// underneath and unmounts while fully covered, so the handoff is
// pixel-identical and cannot flash. Taps mid-transition are ignored.
type AuthRoute = 'login' | 'register' | 'admin-login';

// cubic-bezier(0.05, 0.7, 0.1, 1.0) — Material emphasized easing.
const EMPHASIZED = Easing.bezier(0.05, 0.7, 0.1, 1.0);
const PUSH_DURATION = 600;
const SCREEN_WIDTH = Dimensions.get('window').width;

function PushEnter({
  direction,
  children,
}: {
  direction: 'forward' | 'back';
  children: React.ReactNode;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: PUSH_DURATION,
      easing: EMPHASIZED,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [direction === 'forward' ? SCREEN_WIDTH : -SCREEN_WIDTH, 0],
  });

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
    >
      {children}
    </Animated.View>
  );
}

function BootSplash() {
  return (
    <View style={styles.splash}>
      <Image source={bootLogo} style={styles.splashLogo} resizeMode="contain" />
      <ActivityIndicator size="large" color="#0D7E52" />
    </View>
  );
}

function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/password/i.test(msg) && /incorrect|invalid/i.test(msg)) {
    return 'Incorrect email or password.';
  }
  if (/not found|could not find/i.test(msg)) {
    return 'No account found for this email. Please sign up first.';
  }
  if (/network|fetch|connection/i.test(msg)) {
    return 'Network error. Check your connection and retry.';
  }
  return msg || 'Authentication failed. Please try again.';
}

type Route =
  | 'login'
  | 'register'
  | 'admin-login'
  | 'discovery'
  | 'gate'
  | 'main'
  | 'admin';

function InnerApp() {
  const [route, setRoute] = useState<Route>('login');
  const [userRole, setUserRole] = useState('user');
  const [ready, setReady] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const { isLoaded: authLoaded, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { signIn, setActive: setActiveSignIn, isLoaded: signInLoaded } =
    useSignIn();
  const { signUp, setActive: setActiveSignUp, isLoaded: signUpLoaded } =
    useSignUp();
  const { startSSOFlow } = useSSO();

  // Mirrors Flutter main(): init Supabase, then best-effort anon org resolve.
  // Conference data loads stay on mocks until Clerk provides a JWT.
  useEffect(() => {
    (async () => {
      try {
        await SupabaseService.initialize();
      } catch (e) {
        console.warn('[boot] Supabase not configured, using mock data:', e);
        setReady(true);
        return;
      }
      try {
        await SupabaseService.resolveOrg();
        console.log('[boot] Org resolved:', SupabaseService.orgSlug);
      } catch (e) {
        console.warn('[boot] Org resolve skipped (non-fatal):', e);
      }
      try {
        await SupabaseService.getConferenceConfig();
      } catch {
        console.warn(
          '[boot] Conference config not available pre-auth (non-fatal, needs Clerk JWT)',
        );
      }
      setReady(true);
    })();
  }, []);

  // Warm the in-app browser for Android SSO.
  useEffect(() => {
    WebBrowser.warmUpAsync().catch(() => {});
    return () => {
      WebBrowser.coolDownAsync().catch(() => {});
    };
  }, []);

  // Signed-in session (restored or fresh) always lands on the org gate:
  // members see their org bubbles, non-members go straight to discovery.
  const [pendingJoinSlug, setPendingJoinSlug] = useState('');
  // Which login surface authenticated the session: user login always lands
  // as attendee (even organizers), admin login keeps the real role so
  // organizers reach the admin panel.
  const [loginContext, setLoginContext] = useState<'user' | 'admin'>('user');
  useEffect(() => {
    if (
      authLoaded &&
      isSignedIn &&
      (route === 'login' || route === 'register')
    ) {
      setVerificationPending(false);
      setVerificationError('');
      setRoute('gate');
    }
    if (
      authLoaded &&
      !isSignedIn &&
      (route === 'gate' ||
        route === 'discovery' ||
        route === 'main' ||
        route === 'admin')
    ) {
      setRoute('login');
    }
  }, [authLoaded, isSignedIn, route]);

  async function signInWithPassword(email: string, password: string) {
    if (!signInLoaded) return;
    try {
      const created = await signIn.create({ identifier: email.trim() });
      if (created.status === 'complete') {
        await setActiveSignIn({ session: created.createdSessionId });
        setPendingJoinSlug('');
        setLoginContext('user');
        setRoute('gate');
        return;
      }
      const attempt = await signIn.attemptFirstFactor({
        strategy: 'password',
        password,
      });
      if (attempt.status === 'complete') {
        await setActiveSignIn({ session: attempt.createdSessionId });
        setPendingJoinSlug('');
        setLoginContext('user');
        setRoute('gate');
      } else {
        Alert.alert(
          'Sign in',
          'Additional verification is required on the web. Please sign in via the webapp.',
        );
      }
    } catch (e) {
      Alert.alert('Sign in failed', friendlyError(e));
    }
  }

  async function signInWithSSO(strategy: 'oauth_google' | 'oauth_github') {
    try {
      // Native must exactly match the Clerk Dashboard allowed redirect
      // (added Aug 2026): elmoultaqa://example.com/oauth.
      // Web lets Clerk use its default web redirect instead.
      const redirectUrl =
        Platform.OS === 'web' ? undefined : 'elmoultaqa://example.com/oauth';
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        setPendingJoinSlug('');
        setLoginContext('user');
        setRoute('gate');
      }
    } catch (e) {
      Alert.alert('Sign in failed', friendlyError(e));
    }
  }

  async function signUpWithPassword(
    name: string,
    email: string,
    password: string,
  ) {
    if (!signUpLoaded) return;
    try {
      const parts = name.trim().split(/\s+/);
      const created = await signUp.create({
        firstName: parts[0] ?? '',
        lastName: parts.slice(1).join(' ') || undefined,
        emailAddress: email.trim(),
        password,
      });
      if (created.status === 'complete') {
        await setActiveSignUp({ session: created.createdSessionId });
        setPendingJoinSlug('');
        setLoginContext('user');
        setRoute('gate');
        return;
      }
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerificationPending(true);
      setVerificationError('');
    } catch (e) {
      Alert.alert('Sign up failed', friendlyError(e));
    }
  }

  async function verifyEmailCode(code: string) {
    if (!signUpLoaded || code.length === 0) return;
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });
      if (attempt.status === 'complete') {
        await setActiveSignUp({ session: attempt.createdSessionId });
        setVerificationPending(false);
        setVerificationError('');
        setPendingJoinSlug('');
        setLoginContext('user');
        setRoute('gate');
      } else {
        setVerificationError('Verification incomplete — please try again.');
      }
    } catch (e) {
      setVerificationError(friendlyError(e));
    }
  }

  // Admin login is restricted: after Clerk sign-in the account must hold
  // an owner/admin/moderator role in at least one org (any org, disabled
  // filtered by the RPC). Non-admins get an error and are signed out.
  async function requireAdminRole(): Promise<boolean> {
    try {
      const rows = await SupabaseService.listMyOrganizations();
      return rows.some((r) =>
        ['owner', 'admin', 'moderator'].includes(
          String(r['role'] ?? '').toLowerCase().trim(),
        ),
      );
    } catch (e) {
      Alert.alert(
        'Admin sign in failed',
        e instanceof Error ? e.message : String(e),
      );
      return false;
    }
  }

  async function denyNonAdmin() {
    Alert.alert(
      'Not an administrator',
      'This account has no administrator access to any conference.',
    );
    try {
      await signOut();
    } catch {
      // fall through to local reset
    }
    SupabaseService.tokenProvider = null;
    setRoute('login');
  }

  async function signInAdminWithPassword(email: string, password: string) {
    if (!signInLoaded) return;
    try {
      const created = await signIn.create({ identifier: email.trim() });
      let sessionId: string | null | undefined;
      if (created.status === 'complete') {
        sessionId = created.createdSessionId;
      } else {
        const attempt = await signIn.attemptFirstFactor({
          strategy: 'password',
          password,
        });
        if (attempt.status !== 'complete') {
          Alert.alert(
            'Sign in',
            'Additional verification is required on the web. Please sign in via the webapp.',
          );
          return;
        }
        sessionId = attempt.createdSessionId;
      }
      if (!sessionId) {
        Alert.alert('Sign in failed', 'No session was created.');
        return;
      }
      await setActiveSignIn({ session: sessionId });
      if (await requireAdminRole()) {
        setPendingJoinSlug('');
        setLoginContext('admin');
        setRoute('gate');
      } else {
        await denyNonAdmin();
      }
    } catch (e) {
      Alert.alert('Sign in failed', friendlyError(e));
    }
  }

  async function signInAdminWithSSO() {
    try {
      const redirectUrl =
        Platform.OS === 'web' ? undefined : 'elmoultaqa://example.com/oauth';
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });
      if (!createdSessionId || !setActive) return;
      await setActive({ session: createdSessionId });
      if (await requireAdminRole()) {
        setPendingJoinSlug('');
        setLoginContext('admin');
        setRoute('gate');
      } else {
        await denyNonAdmin();
      }
    } catch (e) {
      Alert.alert('Sign in failed', friendlyError(e));
    }
  }

  const [pending, setPending] = useState<AuthRoute | null>(null);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Conference preview (profile) opened from discovery lists.
  const [preview, setPreview] = useState<DiscoveryEvent | null>(null);

  // Entering a conference from its profile: resolve its org, auto-join
  // public orgs, then open it. Private orgs fall through to the org gate,
  // which shows the registration-code screen.
  const [entering, setEntering] = useState(false);
  const [enteringName, setEnteringName] = useState('');
  const [enterError, setEnterError] = useState('');

  // Discovery hub state: saved conferences + entered history.
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [myConferences, setMyConferences] = useState<DiscoveryEvent[]>([]);

  // Cross-conference alerts inbox: announcements from every entered
  // conference, newest first. Fetched sequentially (org context is global).
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState('');
  const [alertsFailed, setAlertsFailed] = useState<string[]>([]);
  const [lastSeen, setLastSeen] = useState(0);
  const alertsBusy = useRef(false);

  async function loadAlerts(
    list: Array<{ org_slug: string; org_name: string }>,
  ) {
    if (alertsBusy.current) return;
    if (list.length === 0) {
      setAlerts([]);
      setAlertsError('');
      setAlertsFailed([]);
      return;
    }
    alertsBusy.current = true;
    setAlertsLoading(true);
    setAlertsError('');
    try {
      const items: AlertItem[] = [];
      const failed: string[] = [];
      for (const conf of list) {
        try {
          const rows = await SupabaseService.getNotificationsForOrg(
            conf.org_slug,
          );
          for (const row of rows) {
            items.push(toAlertItem(row, conf.org_slug, conf.org_name));
          }
        } catch {
          failed.push(conf.org_name || conf.org_slug);
        }
      }
      items.sort((a, b) => b.createdAt - a.createdAt);
      setAlerts(items);
      setAlertsFailed(failed);
      setAlertsError(
        items.length === 0 && failed.length > 0
          ? 'Live updates are unreachable right now.'
          : '',
      );
    } finally {
      alertsBusy.current = false;
      setAlertsLoading(false);
    }
  }

  // Restore persisted discovery hub state (best-effort, SecureStore).
  useEffect(() => {
    (async () => {
      const [slugs, conferences, seen] = await Promise.all([
        loadSavedSlugs(),
        loadMyConferences(),
        loadAlertsSeenAt(),
      ]);
      setSavedSlugs(slugs);
      setMyConferences(conferences);
      setLastSeen(seen);
      loadAlerts(conferences);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh the inbox whenever the user returns to discovery.
  useEffect(() => {
    if (route === 'discovery') loadAlerts(myConferences);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  // Phone return button: on the top-level pages (admin, discovery,
  // conference) back would silently kill the app, so confirm first.
  // A conference preview dismisses instead of asking.
  const confirmingExit = useRef(false);
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (preview) {
          setPreview(null);
          return true;
        }
        if (
          route === 'admin' ||
          route === 'discovery' ||
          route === 'gate' ||
          route === 'main'
        ) {
          if (confirmingExit.current) return true;
          confirmingExit.current = true;
          Alert.alert(
            'Leave ElMoultaqa?',
            'Do you want to exit the app?',
            [
              {
                text: 'Stay',
                style: 'cancel',
                onPress: () => {
                  confirmingExit.current = false;
                },
              },
              {
                text: 'Exit',
                style: 'destructive',
                onPress: () => {
                  confirmingExit.current = false;
                  BackHandler.exitApp();
                },
              },
            ],
            {
              cancelable: true,
              onDismiss: () => {
                confirmingExit.current = false;
              },
            },
          );
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [route, preview]);

  function handleAlertsOpened() {
    const now = Date.now();
    setLastSeen(now);
    saveAlertsSeenAt(now);
  }

  function toggleSave(orgSlug: string) {
    const next = savedSlugs.includes(orgSlug)
      ? savedSlugs.filter((slug) => slug !== orgSlug)
      : [...savedSlugs, orgSlug];
    setSavedSlugs(next);
    saveSavedSlugs(next);
  }

  async function handleSelectConference(event: DiscoveryEvent) {
    if (entering || !event.org_slug) return;
    setEntering(true);
    setEnteringName(event.title);
    setEnterError('');
    try {
      await SupabaseService.resolveOrg(event.org_slug);
      console.log('[enter] Org resolved:', SupabaseService.orgSlug);
      // Best-effort auto-join for public orgs (same as webapp
      // registerAttendee with a null code). Private orgs throw a
      // code-required error — fall through to the org gate, which
      // shows the registration-code screen.
      try {
        if (user?.id && user?.primaryEmailAddress?.emailAddress) {
          await SupabaseService.registerAttendee({
            slug: event.org_slug,
            clerkUserId: user.id,
            email: user.primaryEmailAddress.emailAddress,
            fullName: user.fullName ?? '',
            code: null,
          });
        }
      } catch (joinErr) {
        const msg =
          joinErr instanceof Error ? joinErr.message : String(joinErr);
        if (
          /registration code|invalid registration code|private/i.test(msg)
        ) {
          setPreview(null);
          setEntering(false);
          setPendingJoinSlug(event.org_slug);
          setRoute('gate');
          return;
        }
        throw joinErr;
      }
      const next = [
        event,
        ...myConferences.filter((item) => item.org_slug !== event.org_slug),
      ].slice(0, 20);
      setMyConferences(next);
      saveMyConferences(next);
      setPreview(null);
      setRoute('main');
      loadAlerts(next);
    } catch (e) {
      setEnterError(
        e instanceof Error
          ? `Couldn't open "${event.title}": ${e.message}`
          : `Couldn't open "${event.title}".`,
      );
    } finally {
      setEntering(false);
    }
  }

  useEffect(() => {
    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, []);

  async function handleLogout() {
    if (pushTimer.current) clearTimeout(pushTimer.current);
    setPending(null);
    try {
      await signOut();
    } catch {
      // fall through to local reset
    }
    SupabaseService.tokenProvider = null;
    setUserRole('user');
    setPendingJoinSlug('');
    setLoginContext('user');
    setRoute('login');
  }

  // Animated navigation between auth screens. The new screen slides over
  // the old one; the route commits once it fully covers the old screen.
  function goAuth(to: AuthRoute) {
    if (to === route || pending) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    setDirection(to === 'login' ? 'back' : 'forward');
    setPending(to);
    pushTimer.current = setTimeout(() => {
      setRoute(to);
      setPending(null);
    }, PUSH_DURATION + 60);
  }

  function renderAuthScreen(name: AuthRoute) {
    switch (name) {
      case 'login':
        return (
          <AuthScreen
            appName="ElMoultaqa"
            onSignIn={signInWithPassword}
            onGooglePress={() => signInWithSSO('oauth_google')}
            onGithubPress={() => signInWithSSO('oauth_github')}
            onGoRegister={() => goAuth('register')}
            onGoAdminLogin={() => goAuth('admin-login')}
          />
        );
      case 'admin-login':
        return (
          <AdminLoginScreen
            appName="ElMoultaqa"
            onAdminSignIn={signInAdminWithPassword}
            onGooglePress={signInAdminWithSSO}
            onGoBack={() => goAuth('login')}
          />
        );
      default:
        return (
          <RegisterScreen
            appName="ElMoultaqa"
            onSignUp={signUpWithPassword}
            onGoLogin={() => goAuth('login')}
            verificationPending={verificationPending}
            verificationError={verificationError}
            onVerifyCode={verifyEmailCode}
          />
        );
    }
  }

  if (!ready || !authLoaded) {
    return (
      <SafeAreaProvider>
        <BootSplash />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      {route === 'admin' ? (
        <AdminLayout onExit={handleLogout} />
      ) : route === 'main' ? (
        <MainLayout
          userRole={userRole}
          onLogout={handleLogout}
          onBrowse={() => setRoute('discovery')}
        />
      ) : route === 'gate' ? (
        <OrgGate
          key={pendingJoinSlug || 'gate'}
          initialJoinSlug={pendingJoinSlug || undefined}
          onBrowse={() => {
            setPendingJoinSlug('');
            setRoute('discovery');
          }}
          onDone={(slug, role) => {
            void slug;
            setPendingJoinSlug('');
            // User login always lands as attendee (even organizers) —
            // only the admin login surface keeps the real role.
            const effectiveRole =
              loginContext === 'admin' ? role : 'user';
            setUserRole(effectiveRole);
            setRoute(effectiveRole === 'organizer' ? 'admin' : 'main');
          }}
        />
      ) : route === 'discovery' ? (
        <View style={styles.authStack}>
          {preview ? (
            <ConferenceDetailPage
              event={preview}
              onBack={() => setPreview(null)}
              onEnter={() => handleSelectConference(preview)}
              saved={savedSlugs.includes(preview.org_slug)}
              onToggleSave={() => toggleSave(preview.org_slug)}
              entering={entering}
            />
          ) : (
            <DiscoveryLayout
              savedSlugs={savedSlugs}
              onToggleSave={toggleSave}
              myConferences={myConferences}
              onSelect={(event) => setPreview(event)}
              onLogout={handleLogout}
              notice={enterError}
              alerts={alerts}
              alertsLoading={alertsLoading}
              alertsError={alertsError}
              alertsFailed={alertsFailed}
              unreadAlerts={
                alerts.filter((item) => item.createdAt > lastSeen).length
              }
              lastAlertsSeen={lastSeen}
              onRefreshAlerts={() => loadAlerts(myConferences)}
              onAlertsOpened={handleAlertsOpened}
              onOpenConference={(orgSlug) => {
                const found = myConferences.find(
                  (item) => item.org_slug === orgSlug,
                );
                if (found) setPreview(found);
              }}
            />
          )}
          {entering && (
            <View style={styles.enteringOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.enteringText} numberOfLines={2}>
                Opening {enteringName || 'conference'}…
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.authStack}>
          {renderAuthScreen(route)}
          {pending && (
            <PushEnter direction={direction}>
              {renderAuthScreen(pending)}
            </PushEnter>
          )}
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default function App() {
  if (!CLERK_KEY) {
    console.warn(
      '[boot] EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY missing — auth will not work. Fill mobile native/.env.',
    );
  }
  return (
    <ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
      <ClerkBridge>
        <InnerApp />
      </ClerkBridge>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  authStack: {
    flex: 1,
  },
  enteringOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11,31,26,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  enteringText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  splash: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  splashLogo: {
    width: 120,
    height: 120,
  },
});
