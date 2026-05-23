import 'package:flutter/material.dart';
import 'mobile_config.dart';
import 'pages/auth_page.dart';
import 'pages/home_page.dart';
import 'pages/live_page.dart';
import 'pages/program_page.dart';
import 'pages/profile_page.dart';
import 'pages/settings_page.dart';
import 'widgets/sidebar.dart';

void main() {
  runApp(const ElMoultaqaMobileApp());
}

class ElMoultaqaMobileApp extends StatelessWidget {
  const ElMoultaqaMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff' + raw.substring(1);
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff' + raw;
    }
    final themeColor = Color(int.parse(hex));

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: MobileConfig.appName,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: themeColor,
          primary: themeColor,
          secondary: const Color(0xFF1FB69A),
        ),
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFEEFCF4),
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: themeColor,
          iconTheme: IconThemeData(color: themeColor),
          elevation: 0,
          titleTextStyle: TextStyle(
            color: themeColor,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: themeColor,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(999),
            ),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: themeColor,
          ),
        ),
      ),
      initialRoute: '/auth',
      routes: {
        '/auth': (context) => const AuthPage(),
        '/main': (context) => const MobileShell(),
      },
    );
  }
}

class MobileShell extends StatefulWidget {
  const MobileShell({super.key});

  @override
  State<MobileShell> createState() => _MobileShellState();
}

class _MobileShellState extends State<MobileShell> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  int _selectedIndex = 0;

  static final List<Widget> _pages = [
    const HomePage(),
    const ProgramPage(),
    const LivePage(),
    const ProfilePage(),
    const SettingsPage(),
  ];

  void _onItemSelected(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _logout() {
    Navigator.of(context).pushReplacementNamed('/auth');
  }

  @override
  Widget build(BuildContext context) {
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff' + raw.substring(1);
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff' + raw;
    }
    final themeColor = Color(int.parse(hex));

    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: Icon(Icons.menu, color: themeColor),
          onPressed: () {
            _scaffoldKey.currentState?.openDrawer();
          },
        ),
        title: Text(
          MobileConfig.appName,
          style: TextStyle(color: themeColor, fontWeight: FontWeight.bold),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Icon(Icons.event, color: themeColor),
          ),
        ],
      ),
      drawer: Sidebar(
        selectedIndex: _selectedIndex,
        onItemSelected: _onItemSelected,
        onLogout: _logout,
      ),
      body: _pages[_selectedIndex],
    );
  }
}
