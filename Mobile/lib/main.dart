import 'dart:async';

import 'package:flutter/material.dart';
import 'package:clerk_flutter/clerk_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:app_links/app_links.dart';
import 'package:clerk_auth/clerk_auth.dart' as clerk;

import 'admin notif/admin_main_layout.dart';
import 'admin notif/storage.dart';
import 'mobile_config.dart';
import 'pages/auth_page.dart';
import 'pages/home_page.dart';
import 'pages/live_page.dart';
import 'pages/notification_page.dart';
import 'pages/profile_page.dart';
import 'pages/program_page.dart';
import 'pages/settings_page.dart';
import 'services/supabase_service.dart';
import 'theme.dart';
import 'widgets/notification_bell.dart';
import 'widgets/sidebar.dart';

const _redirectionScheme = 'elmoultaqa';
const _redirectionHost = 'example.com';
const _oauthRedirectionPath = '/oauth';
const _emailLinkRedirectionPath = '/email_link';
const _redirectionPaths = [
  _oauthRedirectionPath,
  _emailLinkRedirectionPath
];

/// This function checks a [Uri] to see if it's a deep link that the
/// Clerk SDK should handle. If so, the [Uri] is returned to be consumed
/// by the SDK's `deepLinkStream`. If not, the [Uri] is handled another
/// way, and null returned to tell the Clerk SDK to ignore it.
Future<Uri?> handleDeepLink(Uri uri) async {
  // Check the [Uri]] to see if it should be handled by the Clerk SDK...
  if (uri.scheme == _redirectionScheme &&
      uri.host == _redirectionHost &&
      _redirectionPaths.contains(uri.path)) {
    // ...and if so return it, telling the SDK to handle it.
    return uri;
  }

  // If the host app deems the deep link to be not relevant to the Clerk SDK,
  // we can choose here to process it separately. Alternatively, we can just
  // ignore it for now, and let the app handle it in a different manner.
  await handleDeepLinkInAnotherWay(uri);

  // We then return [null] to inhibit further processing by the SDK.
  return null;
}

/// This function handles a deep link that is not relevant to the Clerk SDK
Future<void> handleDeepLinkInAnotherWay(Uri uri) async {
  // do something with the deep link that is outside the remit
  // of the Clerk SDK
}

/// A function that returns an appropriate deep link [Uri] for the oauth
/// redirect for a given [clerk.Strategy], or [null] if redirection should
/// be handled in-app
Uri? generateDeepLink(BuildContext context, clerk.Strategy strategy) {
  if (strategy.isOauth) {
    return Uri(
      scheme: _redirectionScheme,
      host: _redirectionHost,
      path: _oauthRedirectionPath,
    );
  }

  if (strategy.isEmailLink) {
    return Uri(
      scheme: _redirectionScheme,
      host: _redirectionHost,
      path: _emailLinkRedirectionPath,
    );
  }

  // if you want to use the default in-app SSO, just remove the
  // [redirectionGenerator] parameter from the [ClerkAuthConfig] object
  // below, or...

  return null;
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await dotenv.load(fileName: ".env");
  } catch (e) {
    runApp(ErrorScreen(message: '[Step 1] Failed to load .env file.\n\n$e'));
    return;
  }

  try {
    await SupabaseService.initialize();
  } catch (e) {
    runApp(ErrorScreen(message: '[Step 2] Supabase initialization failed.\n\n$e'));
    return;
  }

  // 3a. Resolve org details — anon-safe, sets name/colors from org row
  try {
    await SupabaseService.resolveOrg();
    if (SupabaseService.orgDetails != null) {
      MobileConfig.loadFromService(SupabaseService.orgDetails, null);
    }
  } catch (e) {
    print('[main] Org resolve skipped (non-fatal): $e');
  }

  // 3b. Event config — may fail pre-auth (org_query needs Clerk JWT)
  try {
    final config = await SupabaseService.getConferenceConfig();
    if (config != null) {
      MobileConfig.loadFromService(SupabaseService.orgDetails, config);
    }
  } catch (e) {
    print('[main] Conference config not available pre-auth (non-fatal): $e');
  }

  final publishableKey = () {
    const env = String.fromEnvironment('CLERK_PUBLISHABLE_KEY');
    if (env.isNotEmpty) return env;
    try {
      return dotenv.maybeGet('CLERK_PUBLISHABLE_KEY') ?? '';
    } catch (_) {
      return '';
    }
  }();

  if (publishableKey.isEmpty) {
    runApp(const ErrorScreen(message: '[Step 4] CLERK_PUBLISHABLE_KEY not found.\n\nChecked --dart-define and .env file.'));
    return;
  }

  runApp(
    ClerkAuth(
      config: ClerkAuthConfig(
        publishableKey: publishableKey,
        loading: const Center(
          child: CircularProgressIndicator(),
        ),
        redirectionGenerator: generateDeepLink,
        deepLinkStream: AppLinks().uriLinkStream.asyncMap(handleDeepLink),
      ),
      child: const ElMoultaqaMobileApp(),
    ),
  );
}

class ErrorScreen extends StatelessWidget {
  final String message;
  const ErrorScreen({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        backgroundColor: const Color(0xFF1A1A2E),
        body: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline, size: 64, color: Color(0xFFE94560)),
                const SizedBox(height: 16),
                const Text(
                  'App Error',
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF16213E),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: SelectableText(
                    message,
                    style: const TextStyle(
                      fontSize: 13,
                      fontFamily: 'monospace',
                      color: Color(0xFFE94560),
                      height: 1.5,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ElMoultaqaMobileApp extends StatelessWidget {
  const ElMoultaqaMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: MobileConfig.appName,
      theme: AppTheme.themed(MobileConfig.parsedThemeColor),
      initialRoute: '/auth',
      routes: {
        '/auth': (context) => const AuthPage(),
        '/main': (context) => const MainLayout(userRole: 'user'),
        '/admin-notif': (context) => const AdminMainLayout(),
      },
    );
  }
}

class MainLayout extends StatefulWidget {
  final String userRole;
  const MainLayout({Key? key, required this.userRole}) : super(key: key);

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> with WidgetsBindingObserver {
  int _selectedIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  String _conferenceName = MobileConfig.appName;
  int _notificationCount = 0;
  Timer? _notificationTimer;
  bool _isAppActive = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _conferenceName = MobileConfig.appName;
    _refreshNotificationCount();
    _notificationTimer = Timer.periodic(
      const Duration(seconds: 30),
      (_) {
        if (_isAppActive) {
          _refreshNotificationCount();
        }
      },
    );
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    _isAppActive = state == AppLifecycleState.resumed;
    if (_isAppActive) {
      _refreshNotificationCount();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _notificationTimer?.cancel();
    super.dispose();
  }

  Future<void> _refreshNotificationCount() async {
    final unreadCount = await AdminStorage.getUnreadNotificationCount();
    if (mounted) {
      setState(() {
        _notificationCount = unreadCount;
      });
    }
  }

  String get _welcomeMessage {
    return _conferenceName;
  }

  Widget _buildPage(int index, ClerkAuthState authState) {
    switch (index) {
      case 0:
        return HomePage(
          userRole: widget.userRole,
          onNavigateToProgram: () => setState(() => _selectedIndex = 1),
        );
      case 1:
        return const ProgramPage();
      case 2:
        return const LivePage();
      case 3:
        return ProfilePage(
          userRole: widget.userRole,
          email: authState.user?.email,
        );
      case 4:
        return const SettingsPage();
      default:
        return HomePage(userRole: widget.userRole);
    }
  }

  Future<bool> _onWillPop() async {
    return await showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              title: Row(
                children: [
                  Icon(
                    Icons.exit_to_app,
                    color: MobileConfig.parsedThemeColor,
                    size: 28,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Quitter l\'application',
                    style: TextStyle(
                      color: MobileConfig.parsedThemeColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              content: const Text(
                'Êtes-vous sûr de vouloir quitter l\'application ?',
                style: TextStyle(fontSize: 16),
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop(false);
                  },
                  child: Text(
                    'Annuler',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 16,
                    ),
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop(true);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: MobileConfig.parsedThemeColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Quitter',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ],
            );
          },
        ) ??
        false;
  }

  Future<void> _confirmDisconnect(ClerkAuthState authState) async {
    final bool shouldDisconnect = await showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              title: Row(
                children: [
                  Icon(
                    Icons.logout,
                    color: MobileConfig.parsedThemeColor,
                    size: 28,
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Déconnexion',
                    style: TextStyle(
                      color: MobileConfig.parsedThemeColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              content: const Text(
                'Êtes-vous sûr de vouloir vous déconnecter de votre compte ?',
                style: TextStyle(fontSize: 16),
              ),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop(false);
                  },
                  child: Text(
                    'Annuler',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 16,
                    ),
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pop(true);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: MobileConfig.parsedThemeColor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Déconnexion',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ],
            );
          },
        ) ??
        false;

    if (shouldDisconnect) {
      await authState.signOut();
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/auth');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeColor = MobileConfig.parsedThemeColor;
    return ClerkAuthBuilder(
      signingInBuilder: (context, authState) => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      signingUpBuilder: (context, authState) => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      signedInBuilder: (context, authState) {
        return PopScope(
          canPop: false,
          onPopInvokedWithResult: (didPop, result) async {
            if (didPop) return;
            final shouldExit = await _onWillPop();
            if (shouldExit && mounted) {
              Navigator.of(context).pop();
            }
          },
          child: Scaffold(
            key: _scaffoldKey,
            appBar: AppBar(
              elevation: 0,
              backgroundColor: Colors.white,
              leading: IconButton(
                icon: Icon(Icons.menu, color: themeColor),
                tooltip: 'Open menu',
                onPressed: () {
                  _scaffoldKey.currentState?.openDrawer();
                },
              ),
              title: Text(
                _welcomeMessage,
                style: TextStyle(
                  color: themeColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              actions: [
                Padding(
                  padding: const EdgeInsets.only(right: 4),
                  child: NotificationBell(
                    notificationCount: _notificationCount,
                    color: themeColor,
                    onPressed: () async {
                      await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const NotificationPage(),
                        ),
                      );
                      _refreshNotificationCount();
                    },
                  ),
                ),
              ],
            ),
            drawer: Sidebar(
              onItemSelected: (index) {
                setState(() {
                  _selectedIndex = index;
                });
                Navigator.pop(context);
              },
              selectedIndex: _selectedIndex,
              onDisconnectRequested: () => _confirmDisconnect(authState),
            ),
            body: _buildPage(_selectedIndex, authState),
          ),
        );
      },
      signedOutBuilder: (context, authState) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted) {
            Navigator.pushReplacementNamed(context, '/auth');
          }
        });
        return const SizedBox.shrink();
      },
      builder: (context, authState) => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
    );
  }
}