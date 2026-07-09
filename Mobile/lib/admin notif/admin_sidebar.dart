import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class AdminSidebar extends StatelessWidget {
  final Function(int) onItemSelected;
  final int selectedIndex;

  const AdminSidebar({
    super.key,
    required this.onItemSelected,
    required this.selectedIndex,
  });

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
      width: 260,
      backgroundColor: const Color(0xFFFDFDFD),
      child: Column(
        children: [
          Container(
            height: 160,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF0D7E52), Color(0xFF1FB69A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    height: 72,
                    width: 72,
                    child: Image.asset(
                      'assets/icons/icon.png',
                      fit: BoxFit.contain,
                      errorBuilder: (context, error, stackTrace) {
                        return const Icon(
                          Icons.admin_panel_settings,
                          size: 64,
                          color: Colors.white,
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Admin Panel',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
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
              ],
            ),
          ),
          const Divider(height: 1),
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
          const SizedBox(height: 8),
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
    final isSelected = selectedIndex == index;
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
      onTap: () => onItemSelected(index),
    );
  }
}
