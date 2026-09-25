import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useClerk, useOrganizationList, useUser } from '@clerk/expo';

import SupabaseService, { Row } from '../services/supabase';
import { THEME_COLOR } from './theme';

export type OrgRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  role: string;
};

type OrgGateProps = {
  onDone: (slug: string, role: 'organizer' | 'user') => void;
};

function mapRole(raw: unknown): 'organizer' | 'user' {
  const r = String(raw ?? '').toLowerCase().trim();
  return r === 'owner' || r === 'admin' || r === 'moderator' || r === 'organizer'
    ? 'organizer'
    : 'user';
}

function toOrgRow(o: Row): OrgRow {
  return {
    id: String(o['id'] ?? ''),
    name: String(o['name'] ?? 'Conference'),
    slug: String(o['slug'] ?? ''),
    logoUrl: String(o['logo_url'] ?? ''),
    role: String(o['role'] ?? 'attendee'),
  };
}

function initials(name: string) {
  const p = name.trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return '•';
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
  return (p[0][0] + p[1][0]).toUpperCase();
}

export default function OrgGate({ onDone }: OrgGateProps) {
  const { user } = useUser();
  const { setActive } = useClerk();
  const { userMemberships } = useOrganizationList();
  const memberships = userMemberships?.data ?? [];

  const [phase, setPhase] = useState<
    'loading' | 'picker' | 'join' | 'code' | 'error'
  >('loading');
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinName, setJoinName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [pendingSlug, setPendingSlug] = useState('');

  const enterOrg = useCallback(
    async (slug: string, role: 'organizer' | 'user') => {
      // Re-resolve explicitly so SecureStore holds the picked org.
      // Conference config loads inside the data hooks of each page.
      await SupabaseService.resolveOrg(slug);
      onDone(slug, role);
    },
    [onDone],
  );

  const refreshOrgs = useCallback(async () => {
    setPhase('loading');
    setError('');
    try {
      const rows = await SupabaseService.listMyOrganizations();
      const list = rows
        .filter((o) => String(o['slug'] ?? '').length > 0)
        .map(toOrgRow);
      setOrgs(list);
      if (list.length === 0) {
        setPhase('join');
      } else if (list.length === 1) {
        await enterOrg(list[0].slug, mapRole(list[0].role));
      } else {
        setPhase('picker');
      }
    } catch (e) {
      console.error('[OrgGate] listMyOrganizations failed:', JSON.stringify(e));
      const err = e as { message?: string; code?: string; details?: string; hint?: string };
      const parts = [err?.message ?? String(e), err?.code, err?.details, err?.hint].filter(Boolean);
      setError(parts.join(' | '));
      setPhase('error');
    }
  }, [enterOrg]);

  useEffect(() => {
    refreshOrgs();
  }, [refreshOrgs]);

  async function tryJoin(slugRaw: string, codeRaw: string): Promise<boolean> {
    const slug = slugRaw
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/^-+|-+$/g, '');
    if (!slug) {
      setError('Enter the conference name.');
      return false;
    }
    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
      setError('Account not ready yet — please wait a moment and retry.');
      return false;
    }
    setJoining(true);
    setError('');
    try {
      // Match the Clerk active org so the JWT org_id fits the target org.
      try {
        const target = memberships.find(
          (m) => m.organization.slug === slug || m.organization.id === slug,
        );
        if (target) await setActive?.({ organization: target.organization.id });
      } catch {
        // non-fatal: public tables stay readable, registered attendees pass
      }
      await SupabaseService.resolveOrg(slug);
      await SupabaseService.registerAttendee({
        slug,
        clerkUserId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        fullName: user.fullName ?? '',
        code: codeRaw.trim() || null,
      });
      const roleRow = await SupabaseService.getMyProfile(
        user.primaryEmailAddress.emailAddress,
      );
      await refreshOrgs();
      // If refresh still doesn't list it (edge), enter directly as user.
      if (roleRow) {
        const rawRole =
          roleRow['role'] ??
          (roleRow['metadata'] as Row | undefined)?.['role'];
        await enterOrg(slug, mapRole(rawRole));
      }
      return true;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (
        msg.toLowerCase().includes('registration code') ||
        msg.toLowerCase().includes('invalid registration code')
      ) {
        setPendingSlug(slug);
        setPhase('code');
      } else {
        setError(msg);
      }
      return false;
    } finally {
      setJoining(false);
    }
  }

  if (phase === 'loading' || joining) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={THEME_COLOR} />
        <Text style={styles.hint}>
          {joining ? 'Joining conference…' : 'Loading your conferences…'}
        </Text>
      </View>
    );
  }

  if (phase === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.hint}>{error}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={refreshOrgs}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryLabel}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (phase === 'code') {
    return (
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>Private conference</Text>
        <Text style={styles.hint}>
          {pendingSlug} requires a registration code. Enter the code from your
          organizer.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Registration code (e.g. XK7-M9Q)"
          placeholderTextColor="#A3A3A3"
          value={joinCode}
          onChangeText={setJoinCode}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {error.length > 0 && <Text style={styles.error}>{error}</Text>}
        <Pressable
          accessibilityRole="button"
          onPress={() => tryJoin(pendingSlug, joinCode)}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryLabel}>Join conference</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setPhase(orgs.length > 1 ? 'picker' : 'join');
            setError('');
          }}
        >
          <Text style={styles.link}>Back</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (phase === 'join') {
    return (
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.title}>Join a conference</Text>
        <Text style={styles.hint}>
          {orgs.length === 0
            ? 'No conferences yet — enter the conference name below. Public conferences join instantly; private ones ask for a code.'
            : 'Enter another conference name to join it.'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Conference name (e.g. hou)"
          placeholderTextColor="#A3A3A3"
          value={joinName}
          onChangeText={setJoinName}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Registration code (only if private)"
          placeholderTextColor="#A3A3A3"
          value={joinCode}
          onChangeText={setJoinCode}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        {error.length > 0 && <Text style={styles.error}>{error}</Text>}
        <Pressable
          accessibilityRole="button"
          onPress={() => tryJoin(joinName, joinCode)}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryLabel}>Join conference</Text>
        </Pressable>
        {orgs.length > 0 && (
          <Pressable accessibilityRole="button" onPress={() => setPhase('picker')}>
            <Text style={styles.link}>Back to my conferences</Text>
          </Pressable>
        )}
      </ScrollView>
    );
  }

  // picker (2+ orgs) — centered bubbles, plus tile to join another
  return (
    <View style={styles.picker}>
      <Text style={styles.title}>Choose your conference</Text>
      <Text style={styles.hint}>
        You belong to {orgs.length} conferences. Disabled ones are hidden.
      </Text>
      <View style={styles.grid}>
        {orgs.map((org) => (
          <View key={org.id} style={styles.cell}>
            <Pressable
              accessibilityRole="button"
              onPress={() => enterOrg(org.slug, mapRole(org.role))}
              style={styles.bubble}
            >
              <Text style={styles.bubbleText}>{initials(org.name)}</Text>
            </Pressable>
            <Text style={styles.cellName} numberOfLines={1}>
              {org.name}
            </Text>
            <Text style={styles.cellSlug} numberOfLines={1}>
              {org.slug}
            </Text>
          </View>
        ))}
        <View style={styles.cell}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setJoinName('');
              setJoinCode('');
              setError('');
              setPhase('join');
            }}
            style={styles.plusBubble}
          >
            <Text style={styles.plusText}>+</Text>
          </Pressable>
          <Text style={styles.cellName}>Join</Text>
          <Text style={styles.cellSlug}>via name + code</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  picker: {
    flex: 1,
    backgroundColor: '#141414',
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  form: {
    flexGrow: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  hint: {
    marginTop: 8,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  grid: {
    marginTop: 28,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    maxWidth: 720,
  },
  cell: {
    width: 110,
    alignItems: 'center',
  },
  bubble: {
    width: 110,
    height: 110,
    borderRadius: 16,
    backgroundColor: THEME_COLOR,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 28,
  },
  cellName: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  cellSlug: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    textAlign: 'center',
  },
  plusBubble: {
    width: 110,
    height: 110,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 36,
    color: '#FFFFFF',
    lineHeight: 40,
  },
  input: {
    marginTop: 12,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    color: '#FFFFFF',
  },
  error: {
    marginTop: 10,
    fontSize: 12,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 16,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: THEME_COLOR,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  link: {
    marginTop: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
