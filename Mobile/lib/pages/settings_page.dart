import 'package:flutter/material.dart';
import '../mobile_config.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final themeColor = Color(int.parse(MobileConfig.themeColor));

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Settings',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: themeColor,
              ),
            ),
            const SizedBox(height: 16),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 24,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                children: [
                  _settingTile(
                    'Notifications',
                    'Manage event alerts and reminders',
                    themeColor,
                  ),
                  _divider(),
                  _settingTile(
                    'Privacy',
                    'Control your data and privacy settings',
                    themeColor,
                  ),
                  _divider(),
                  _settingTile('Language', 'Select app language', themeColor),
                  _divider(),
                  _settingTile(
                    'Help & support',
                    'Get assistance with your conference app',
                    themeColor,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _settingTile(String title, String subtitle, Color themeColor) {
    return ListTile(
      title: Text(
        title,
        style: TextStyle(fontWeight: FontWeight.bold, color: themeColor),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(color: Color(0xFF6B7280)),
      ),
      trailing: const Icon(Icons.chevron_right, color: Color(0xFF9CA3AF)),
      onTap: () {},
    );
  }

  Widget _divider() {
    return const Divider(
      height: 1,
      indent: 16,
      endIndent: 16,
      color: Color(0xFFE5E7EB),
    );
  }
}
