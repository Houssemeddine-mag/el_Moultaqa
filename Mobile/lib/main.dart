import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'mobile_config.dart';
import 'theme.dart';
import 'pages/auth_page.dart';
import 'pages/home_page.dart';
import 'pages/program_page.dart';
import 'pages/keynote_speakers_page.dart';
import 'pages/direct_page.dart';
import 'pages/profile_page.dart';
import 'pages/settings_page.dart';
import 'admin notif/admin_main_layout.dart';
import 'widgets/sidebar.dart';
import 'widgets/notification_bell.dart';

void main() {
  runApp(const ElMoultaqaMobileApp());
}

class ElMoultaqaMobileApp extends StatelessWidget {
  const ElMoultaqaMobileApp({super.key});

  Color _parseThemeColor() {
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff' + raw.substring(1);
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff' + raw;
    }
    return Color(int.parse(hex));
  }

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

// Main Layout with navigation similar to RIF app
class MainLayout extends StatefulWidget {
  final String userRole;
  const MainLayout({Key? key, required this.userRole}) : super(key: key);

  @override
  State<MainLayout> createState() => _MainLayoutState();
}

class _MainLayoutState extends State<MainLayout> {
  int _selectedIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  String _conferenceName = 'ElMoultaqa';

  @override
  void initState() {
    super.initState();
    _loadConferenceName();
  }

  Future<void> _loadConferenceName() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final config = prefs.getString('elm_conference_config');
      if (config != null) {
        final nameMatch = RegExp(r'"name"\s*:\s*"([^"]*)"').firstMatch(config);
        if (nameMatch != null && nameMatch.group(1)!.isNotEmpty) {
          setState(() {
            _conferenceName = nameMatch.group(1)!;
          });
          return;
        }
      }
    } catch (e) {
      // Fallback to default
    }
    setState(() {
      _conferenceName = 'ElMoultaqa';
    });
  }

  String get _welcomeMessage {
    return _conferenceName;
  }

  Widget _buildPage(int index) {
    switch (index) {
      case 0:
        return HomePage(userRole: widget.userRole);
      case 1:
        return const ProgramPage();
      case 2:
        return const DirectPage();
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
              title: Row(
                children: const [
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

  Future<void> _confirmDisconnect() async {
    final bool shouldDisconnect = await showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              title: Row(
                children: const [
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
      Navigator.pushReplacementNamed(context, '/auth');
    }
  }

  @override
  Widget build(BuildContext context) {
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
        ),
        drawer: Sidebar(
          onItemSelected: (index) {
            setState(() {
              _selectedIndex = index;
            });
            Navigator.pop(context);
          },
          selectedIndex: _selectedIndex,
          onDisconnectRequested: _confirmDisconnect,
        ),
        body: _buildPage(_selectedIndex),
      ),
    );
  }
}
