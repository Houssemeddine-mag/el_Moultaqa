import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthScreen from './auth/AuthScreen';
import RegisterScreen from './auth/RegisterScreen';
import MainLayout from './pages/MainLayout';
import AdminLayout from './admin/AdminLayout';
import SupabaseService from './services/supabase';

const bootLogo = require('./assets/images/logo.png');

function BootSplash() {
  return (
    <View style={styles.splash}>
      <Image source={bootLogo} style={styles.splashLogo} resizeMode="contain" />
      <ActivityIndicator size="large" color="#0D7E52" />
    </View>
  );
}

export default function App() {
  const [route, setRoute] = useState<'login' | 'register' | 'main' | 'admin'>(
    'login',
  );
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
    // Dev only: test1 opens the admin panel (mirrors the Flutter admin app).
    if (id === 'test1') {
      setRoute('admin');
      return;
    }
    setUserRole(id === 'test' ? 'organizer' : 'user');
    setRoute('main');
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
        <AdminLayout onExit={() => setRoute('login')} />
      ) : route === 'main' ? (
        <MainLayout userRole={userRole} onLogout={() => setRoute('login')} />
      ) : route === 'login' ? (
        <AuthScreen
          appName="ElMoultaqa"
          onSignIn={handleSignIn}
          onGoRegister={() => setRoute('register')}
        />
      ) : (
        <RegisterScreen
          appName="ElMoultaqa"
          onSignUp={() => {
            setUserRole('user');
            setRoute('main');
          }}
          onGoLogin={() => setRoute('login')}
        />
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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
