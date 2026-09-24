import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
import MainLayout from './pages/MainLayout';
import AdminLayout from './admin/AdminLayout';
import SupabaseService from './services/supabase';

const bootLogo = require('./assets/images/logo.png');

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

export default function App() {
  const [route, setRoute] = useState<
    'login' | 'register' | 'admin-login' | 'discovery' | 'main' | 'admin'
  >('login');
  // Dev only: test creds sign in as organizer to preview the full UI.
  const [userRole, setUserRole] = useState('user');
  const [ready, setReady] = useState(false);

  // Mirrors Flutter main(): init Supabase, then resolve the org (anon-safe).
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

  function handleSignIn(email: string) {
    const id = email.trim();
    // User side only: test signs in as organizer, everything else as user.
    // test1 is admin-only and never reaches here (rejected by AuthScreen).
    // Everyone lands on conference discovery first (like the landing page).
    setUserRole(id === 'test' ? 'organizer' : 'user');
    setRoute('discovery');
  }

  function handleAdminSignIn() {
    setRoute('admin');
  }

  const [pending, setPending] = useState<AuthRoute | null>(null);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Conference preview (profile) opened from discovery lists.
  const [preview, setPreview] = useState<DiscoveryEvent | null>(null);

  // Entering a conference from its profile: resolve its org, then open it.
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
        if (route === 'admin' || route === 'discovery' || route === 'main') {
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
            { cancelable: true, onDismiss: () => {
              confirmingExit.current = false;
            } },
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

  function handleLogout() {
    if (pushTimer.current) clearTimeout(pushTimer.current);
    setPending(null);
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
            onSignIn={handleSignIn}
            onGoRegister={() => goAuth('register')}
            onGoAdminLogin={() => goAuth('admin-login')}
          />
        );
      case 'admin-login':
        return (
          <AdminLoginScreen
            appName="ElMoultaqa"
            onAdminSignIn={handleAdminSignIn}
            onGooglePress={handleAdminSignIn}
            onGoBack={() => goAuth('login')}
          />
        );
      default:
        return (
          <RegisterScreen
            appName="ElMoultaqa"
            onSignUp={() => {
              setUserRole('user');
              setRoute('discovery');
            }}
            onGoLogin={() => goAuth('login')}
          />
        );
    }
  }

  if (!ready) {
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
