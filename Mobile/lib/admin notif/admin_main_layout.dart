import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../mobile_config.dart';
import 'admin_home_page.dart';
import 'admin_program_page.dart';
import 'admin_notifications_page.dart';
import 'admin_questions_page.dart';
import 'admin_sidebar.dart';

class AdminMainLayout extends StatefulWidget {
  const AdminMainLayout({super.key});

  @override
  State<AdminMainLayout> createState() => _AdminMainLayoutState();
}

class _AdminMainLayoutState extends State<AdminMainLayout> {
  int _selectedIndex = 0;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  String _conferenceName = 'ElMoultaqa';
  late Color _themeColor;

  @override
  void initState() {
    super.initState();
    _themeColor = _parseThemeColor(MobileConfig.themeColor);
    _loadConferenceName();
  }

  Color _parseThemeColor(String? rawColor) {
    final raw = rawColor ?? '0xFF0D7E52';
    final hex = raw.startsWith('#')
        ? '0xff${raw.substring(1)}'
        : raw.startsWith('0x')
            ? raw
            : '0xff$raw';
    return Color(int.parse(hex));
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
    } catch (_) {}

    setState(() {
      _conferenceName = 'ElMoultaqa';
    });
  }

  Widget _buildPage(int index) {
    switch (index) {
      case 0:
        return AdminHomePage(
          themeColor: _themeColor,
          onOpenProgram: () => setState(() => _selectedIndex = 1),
          onOpenNotifications: () => setState(() => _selectedIndex = 2),
          onOpenQuestions: () => setState(() => _selectedIndex = 3),
        );
      case 1:
        return AdminProgramPage(themeColor: _themeColor);
      case 2:
        return AdminNotificationsPage(themeColor: _themeColor);
      case 3:
        return AdminQuestionsPage(themeColor: _themeColor);
      default:
        return AdminHomePage(
          themeColor: _themeColor,
          onOpenProgram: () => setState(() => _selectedIndex = 1),
          onOpenNotifications: () => setState(() => _selectedIndex = 2),
          onOpenQuestions: () => setState(() => _selectedIndex = 3),
        );
    }
  }

  Future<bool> _onWillPop() async {
    return await showDialog<bool>(
          context: context,
          barrierDismissible: false,
          builder: (context) {
            return AlertDialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              title: Row(
                children: [
                  Icon(Icons.logout, color: _themeColor, size: 28),
                  const SizedBox(width: 12),
                  Text(
                    'Leave admin panel',
                    style: TextStyle(
                      color: _themeColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              content: const Text(
                'Do you want to exit the admin panel?',
                style: TextStyle(fontSize: 16),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  child: Text(
                    'Cancel',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(true),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _themeColor,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text('Exit'),
                ),
              ],
            );
          },
        ) ??
        false;
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final shouldExit = await _onWillPop();
        if (shouldExit && context.mounted) {
          Navigator.of(context).pop();
        }
      },
      child: Scaffold(
        key: _scaffoldKey,
        appBar: AppBar(
          elevation: 0,
          backgroundColor: Colors.white,
          leading: IconButton(
            icon: Icon(Icons.menu, color: _themeColor),
            onPressed: () => _scaffoldKey.currentState?.openDrawer(),
          ),
          title: Text(
            _conferenceName,
            style: TextStyle(
              color: _themeColor,
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
        ),
        drawer: AdminSidebar(
          selectedIndex: _selectedIndex,
          onItemSelected: (index) {
            setState(() => _selectedIndex = index);
            Navigator.pop(context);
          },
        ),
        body: _buildPage(_selectedIndex),
      ),
    );
  }
}
