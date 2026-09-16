import 'package:clerk_auth/clerk_auth.dart' as clerk;
import 'package:flutter/material.dart';
import 'package:clerk_flutter/clerk_flutter.dart';

import '../mobile_config.dart';
import '../services/supabase_service.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({super.key});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  @override
  void initState() {
    super.initState();
    _tryResolveOrg();
  }

  Future<void> _tryResolveOrg() async {
    try {
      await SupabaseService.resolveOrg();
      final config = await SupabaseService.getConferenceConfig();
      MobileConfig.loadFromService(SupabaseService.orgDetails, config);
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return ClerkAuthBuilder(
      signingInBuilder: (context, authState) => Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 24),
              TextButton(
                onPressed: () => authState.signOut(),
                child: const Text('Cancel'),
              ),
            ],
          ),
        ),
      ),
      signingUpBuilder: (context, authState) => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      signedInBuilder: (context, authState) {
        SupabaseService.tokenProvider = () async {
          try {
            final dynamic t = await authState.sessionToken(templateName: 'supabase');
            if (t == null) return null;
            // SessionToken object holds the raw JWT in `.jwt` — NEVER use toString()
            // (InformativeToStringMixin would send "SessionToken(...)" → PGRST301).
            try {
              final String? raw = (t as dynamic).jwt as String?;
              if (raw != null && raw.contains('.') && raw.split('.').length == 3) {
                return raw;
              }
            } catch (_) {}
            if (t is String && t.contains('.')) return t;
            final fallback = t.toString();
            if (fallback.contains('.') && fallback.split('.').length == 3) return fallback;
            print('[Auth] sessionToken returned non-JWT shape: $fallback');
            return null;
          } catch (e) {
            print('[Auth] Clerk JWT fetch failed, falling back to anon: $e');
            return null;
          }
        };
        return _OrgGate(authState: authState);
      },
      signedOutBuilder: (context, authState) {
        return _SocialSignInPage(authState: authState);
      },
      builder: (context, authState) => _SocialSignInPage(authState: authState),
    );
  }
}

class _SocialSignInPage extends StatelessWidget {
  const _SocialSignInPage({required this.authState});

  final ClerkAuthState authState;

  @override
  Widget build(BuildContext context) {
    final themeColor = MobileConfig.parsedThemeColor;
    final logoUrl = MobileConfig.logoUrl;
    final showLogo = logoUrl.isNotEmpty
        ? NetworkImage(logoUrl) as ImageProvider
        : const AssetImage('assets/images/logo.png') as ImageProvider;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Image(
                    image: showLogo,
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: themeColor.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Icon(Icons.event, size: 40, color: themeColor),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Welcome to',
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[500],
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  MobileConfig.appName,
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: themeColor,
                    height: 1.2,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),
                _SocialButton(
                  icon: _GoogleIcon(),
                  label: 'Continue with Google',
                  onPressed: () => authState.ssoSignIn(
                    context,
                    clerk.Strategy.oauthGoogle,
                  ),
                  borderColor: themeColor,
                ),
                const SizedBox(height: 12),
                _SocialButton(
                  icon: _GithubIcon(),
                  label: 'Continue with GitHub',
                  onPressed: () => authState.ssoSignIn(
                    context,
                    clerk.Strategy.oauthGithub,
                  ),
                  borderColor: themeColor,
                ),
                const SizedBox(height: 32),
                Text(
                  'By continuing, you agree to our Terms of Service',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[400],
                    height: 1.4,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SocialButton extends StatelessWidget {
  const _SocialButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    this.borderColor,
  });

  final Widget icon;
  final String label;
  final VoidCallback onPressed;
  final Color? borderColor;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF1F1F1F),
          side: BorderSide(
            color: borderColor?.withValues(alpha: 0.3) ?? const Color(0xFFDADCE0),
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 24,
              height: 24,
              child: icon,
            ),
            const SizedBox(width: 12),
            Text(label),
          ],
        ),
      ),
    );
  }
}

class _GoogleIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: const Text(
        'G',
        style: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: Color(0xFF4285F4),
          fontFamily: 'sans-serif',
          height: 1.1,
        ),
      ),
    );
  }
}

class _GithubIcon extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF24292F),
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: const Text(
        'GH',
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: Colors.white,
          height: 1.1,
        ),
      ),
    );
  }
}

/// Resolves the org config from Supabase using the ORG_SLUG.
/// Routes to /main on success, shows _NoOrgScreen on failure.
class _OrgGate extends StatefulWidget {
  const _OrgGate({required this.authState});

  final ClerkAuthState authState;

  @override
  State<_OrgGate> createState() => _OrgGateState();
}

class _OrgGateState extends State<_OrgGate> {
  bool _checking = true;
  bool _hasOrg = false;
  String _derivedRole = 'user';

  @override
  void initState() {
    super.initState();
    _checkMembership();
  }

  String _mapRoleToUserRole(String? rawRole) {
    final r = (rawRole ?? '').toLowerCase().trim();
    if (r == 'admin' || r == 'moderator' || r == 'organizer') return 'organizer';
    return 'user';
  }

  String _errorDetail = '';
  Future<void> _checkMembership() async {
    try {
      print('[OrgGate] Resolving org with ORG_SLUG=${SupabaseService.orgSlug ?? "null"} env=${MobileConfig.orgSlug}');
      await SupabaseService.resolveOrg();
      print('[OrgGate] Resolved orgSlug=${SupabaseService.orgSlug} schema=${SupabaseService.schemaName}');
      // Set Clerk active organization to match the requested org slug, so the
      // `supabase` JWT template carries the correct org_id for ANY org
      // (sakura, moh, or future orgs) — not just the last-active one.
      try {
        final targetClerkOrgId = SupabaseService.orgDetails?['clerk_org_id']?.toString();
        if (targetClerkOrgId != null && targetClerkOrgId.isNotEmpty) {
          final memberships = widget.authState.user?.organizationMemberships;
          clerk.Organization? match;
          if (memberships != null) {
            for (final m in memberships) {
              if (m.organization.id == targetClerkOrgId) {
                match = m.organization;
                break;
              }
            }
          }
          if (match != null) {
            print('[OrgGate] Setting active Clerk org to $targetClerkOrgId');
            await widget.authState.setActiveOrganization(match);
          } else {
            print('[OrgGate] User not in Clerk org $targetClerkOrgId — JWT org_id stays as-is (public tables still readable)');
          }
        }
      } catch (e) {
        print('[OrgGate] setActiveOrganization failed (non-fatal): $e');
      }
      if (SupabaseService.orgSlug != null && SupabaseService.orgSlug!.isNotEmpty) {
        print('[OrgGate] Fetching conference config for ${SupabaseService.orgSlug}');
        final config = await SupabaseService.getConferenceConfig();
        print('[OrgGate] Config: $config');
        MobileConfig.loadFromService(SupabaseService.orgDetails, config);
        // Derive role from Supabase users table (role: admin/speaker/attendee/moderator)
        try {
          final email = widget.authState.user?.email;
          print('[OrgGate] Deriving role for email=$email');
          if (email != null && email.isNotEmpty) {
            SupabaseService.currentUserEmail = email;
            final profile = await SupabaseService.getMyProfile(email);
            print('[OrgGate] Profile for $email: $profile');
            if (profile != null) {
              final rawRole = profile['role']?.toString() ??
                  (profile['metadata'] is Map ? (profile['metadata'] as Map)['role']?.toString() : null);
              _derivedRole = _mapRoleToUserRole(rawRole);
            } else {
              print('[OrgGate] No profile yet — will auto-create as attendee on next fetchUserProfile');
            }
          }
        } catch (e) {
          print('[OrgGate] Role derive failed: $e');
        }
        if (mounted) {
          setState(() {
            _hasOrg = true;
            _checking = false;
          });
        }
        _redirect();
        return;
      }
    } catch (e, st) {
      print('[OrgGate] FAILED: $e\n$st');
      _errorDetail = e.toString();
    }

    if (mounted) {
      setState(() {
        _hasOrg = false;
        _checking = false;
      });
    }
  }

  void _redirect() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/main', arguments: _derivedRole);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_checking) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (!_hasOrg) {
      return _NoOrgScreen(errorDetail: _errorDetail);
    }

    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}

class _NoOrgScreen extends StatelessWidget {
  final String errorDetail;
  const _NoOrgScreen({this.errorDetail = ''});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.group_off, size: 64, color: Colors.grey[400]),
              const SizedBox(height: 16),
              Text(
                'No Conference Available',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[800],
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Your account is not associated with any conference. '
                'Please contact the event organizer to get access.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 14, color: Colors.grey[600], height: 1.5),
              ),
              if (errorDetail.isNotEmpty) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.red.withValues(alpha: 0.2)),
                  ),
                  child: SelectableText(
                    'Debug: $errorDetail\nSlug tried: ${SupabaseService.orgSlug ?? MobileConfig.orgSlug}',
                    style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: Colors.red),
                  ),
                ),
                const SizedBox(height: 12),
                SelectableText(
                  errorDetail.contains('PGRST301') || errorDetail.contains('JWT')
                      ? 'JWT error (PGRST301): Clerk Supabase JWT template "supabase" is misconfigured. In Clerk Dashboard → JWT Templates → check "supabase" template exists and Supabase JWT secret matches Supabase project (Supabase Dashboard → Project Settings → API → JWT Secret). Then reinstall: adb shell pm clear com.example.elmoultaqa_mobile'
                      : 'Fix: Ensure Mobile/.env has ORG_SLUG=sakura and reinstall: adb shell pm clear com.example.elmoultaqa_mobile',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}