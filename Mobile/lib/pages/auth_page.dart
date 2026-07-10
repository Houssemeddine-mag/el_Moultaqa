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
      loadingBuilder: (context) => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      signedInBuilder: (context, authState) {
        SupabaseService.tokenProvider = () async {
          final clerkToken = await authState.sessionToken(templateName: 'supabase');
          return clerkToken.toString();
        };
        return _OrgGate(authState: authState);
      },
      signedOutBuilder: (context, authState) {
        return const ClerkAuthentication();
      },
    );
  }
}

/// Checks that the signed-in user belongs to at least one organization.
/// Routes to /main if they do, shows _NoOrgScreen if they don't.
class _OrgGate extends StatefulWidget {
  const _OrgGate({required this.authState});

  final ClerkAuthState authState;

  @override
  State<_OrgGate> createState() => _OrgGateState();
}

class _OrgGateState extends State<_OrgGate> {
  bool _checking = true;
  bool _hasOrg = false;

  @override
  void initState() {
    super.initState();
    _checkMembership();
  }

  Future<void> _checkMembership() async {
    // Try Clerk's organizationMemberships first (fast, local)
    try {
      final user = widget.authState.user;
      if (user?.hasOrganizations == true) {
        if (mounted) {
          setState(() {
            _hasOrg = true;
            _checking = false;
          });
        }
        _redirect();
        return;
      }
    } catch (_) {}

    // Fallback: try resolving the org from saved slug
    try {
      await SupabaseService.resolveOrg();
      if (SupabaseService.orgSlug != null && SupabaseService.orgSlug!.isNotEmpty) {
        final config = await SupabaseService.getConferenceConfig();
        MobileConfig.loadFromService(SupabaseService.orgDetails, config);
        if (mounted) {
          setState(() {
            _hasOrg = true;
            _checking = false;
          });
        }
        _redirect();
        return;
      }
    } catch (_) {}

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
        Navigator.pushReplacementNamed(context, '/main');
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
      return const _NoOrgScreen();
    }

    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}

class _NoOrgScreen extends StatelessWidget {
  const _NoOrgScreen();

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
            ],
          ),
        ),
      ),
    );
  }
}