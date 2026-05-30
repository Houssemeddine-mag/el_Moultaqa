import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AdminSidebar extends StatefulWidget {
  final Function(int) onItemSelected;
  final int selectedIndex;

  const AdminSidebar({
    super.key,
    required this.onItemSelected,
    required this.selectedIndex,
  });

  @override
  State<AdminSidebar> createState() => _AdminSidebarState();
}

class _AdminSidebarState extends State<AdminSidebar> {
  String _conferenceName = 'ElMoultaqa';

  @override
  void initState() {
    super.initState();
    _loadConferenceName();
  }

  Future<void> _loadConferenceName() async {
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
  }

  Future<void> _launchWebApp() async {
    const url = 'https://elmoultaqa.com';
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: const Color(0xFFFDFDFD),
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          Container(
            height: 146,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF0D7E52), Color(0xFF1FB69A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: Center(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    SizedBox(
                      height: 48,
                      child: Image.asset(
                        '../global/logo.png',
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) {
                          return const Icon(
                            Icons.admin_panel_settings,
                            size: 48,
                            color: Colors.white,
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _conferenceName,
                      textAlign: TextAlign.center,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          _buildNavItem(
            context,
            icon: Icons.home_outlined,
            title: 'Home',
            index: 0,
          ),
          _buildNavItem(
            context,
            icon: Icons.calendar_month_outlined,
            title: 'Program',
            index: 1,
          ),
          _buildNavItem(
            context,
            icon: Icons.notifications_active_outlined,
            title: 'Notifications',
            index: 2,
          ),
          _buildNavItem(
            context,
            icon: Icons.question_answer_outlined,
            title: 'Questions',
            index: 3,
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.language, color: Color(0xFF0D7E52)),
            title: const Text(
              'Visit WebApp',
              style: TextStyle(
                color: Color(0xFF0D7E52),
                fontWeight: FontWeight.w600,
              ),
            ),
            onTap: () {
              _launchWebApp();
              Navigator.pop(context);
            },
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required int index,
  }) {
    final isSelected = widget.selectedIndex == index;
    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? const Color(0xFF0D7E52) : Colors.grey,
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? const Color(0xFF0D7E52) : Colors.grey,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
      selected: isSelected,
      selectedTileColor: const Color(0xFF0D7E52).withValues(alpha: 0.1),
      onTap: () => widget.onItemSelected(index),
    );
  }
}
