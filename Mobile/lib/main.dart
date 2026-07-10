import 'dart:async';

import 'package:flutter/material.dart';
import 'package:clerk_flutter/clerk_flutter.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

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

  try {
    await SupabaseService.resolveOrg();
    final config = await SupabaseService.getConferenceConfig();
    MobileConfig.loadFromService(SupabaseService.orgDetails, config);
  } catch (e) {
    // Non-fatal — app works with defaults
    print('[main] Org resolve skipped (non-fatal): $e');
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
    runApp(ErrorScreen(message: '[Step 4] CLERK_PUBLISHABLE_KEY not found.\n\nChecked --dart-define and .env file.'));
    return;
  }

  runApp(
    ClerkAuth(
      config: ClerkAuthConfig(publishableKey: publishableKey),
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
      theme: AppTheme.theme,
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

class _MainLayoutState extends State<MainLayout> {
  int _selectedIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  String _conferenceName = MobileConfig.appName;
  int _notificationCount = 0;
  Timer? _notificationTimer;

  @override
  void initState() {
    super.initState();
    _conferenceName = MobileConfig.appName;
    _refreshNotificationCount();
    _notificationTimer = Timer.periodic(
      const Duration(seconds: 30),
      (_) => _refreshNotificationCount(),
    );
  }

  @override
  void dispose() {
    _notificationTimer?.cancel();
    super.dispose();
  }

  Future<void> _refreshNotificationCount() async {
    final notifications = await AdminStorage.loadNotifications();
    if (mounted) {
      setState(() {
        _notificationCount = notifications.length;
      });
    }
  }

  String get _welcomeMessage {
    return _conferenceName;
  }

  Widget _buildPage(int index) {
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
        return ProfilePage(userRole: widget.userRole);
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
              title: const Row(
                children: [
                  Icon(
                    Icons.exit_to_app,
                    color: Color(0xFF0D7E52),
                    size: 28,
                  ),
                  SizedBox(width: 12),
                  Text(
                    'Quitter l\'application',
                    style: TextStyle(
                      color: Color(0xFF0D7E52),
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
                    backgroundColor: const Color(0xFF0D7E52),
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
              title: const Row(
                children: [
                  Icon(
                    Icons.logout,
                    color: Color(0xFF0D7E52),
                    size: 28,
                  ),
                  SizedBox(width: 12),
                  Text(
                    'Déconnexion',
                    style: TextStyle(
                      color: Color(0xFF0D7E52),
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
                    backgroundColor: const Color(0xFF0D7E52),
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
    return ClerkAuthBuilder(
      loadingBuilder: (context) => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      signedInBuilder: (context, authState) {
        return PopScope(
          canPop: true,
          onPopInvokedWithResult: (didPop, result) async {
            if (didPop) return;
            final shouldExit = await _onWillPop();
            if (shouldExit) {
              Navigator.of(context).pop();
            }
          },
          child: Scaffold(
            key: _scaffoldKey,
            appBar: AppBar(
              elevation: 0,
              backgroundColor: Colors.white,
              leading: IconButton(
                icon: const Icon(Icons.menu, color: Color(0xFF0D7E52)),
                onPressed: () {
                  _scaffoldKey.currentState?.openDrawer();
                },
              ),
              title: Text(
                _welcomeMessage,
                style: const TextStyle(
                  color: Color(0xFF0D7E52),
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              actions: [
                Padding(
                  padding: const EdgeInsets.only(right: 4),
                  child: NotificationBell(
                    notificationCount: _notificationCount,
                    color: const Color(0xFF0D7E52),
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const NotificationPage(),
                        ),
                      );
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
            body: _buildPage(_selectedIndex),
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
    );
  }
}