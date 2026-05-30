import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _notificationsEnabled = true;

  @override
  void initState() {
    super.initState();
    _loadNotificationSettings();
  }

  Future<void> _loadNotificationSettings() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      setState(() {
        _notificationsEnabled = prefs.getBool('notifications_enabled') ?? true;
      });
    } catch (e) {
      // Default to true
    }
  }

  Future<void> _saveNotificationSettings(bool value) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('notifications_enabled', value);
      setState(() {
        _notificationsEnabled = value;
      });
    } catch (e) {
      // Handle error
    }
  }

  void _showPrivacyPolicy(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Privacy & Security',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF0D7E52),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Data Usage & Protection',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'We collect and store your conference registration data including email, name, and profile information solely to provide you with a seamless conference experience. This data is used exclusively for:',
                    style: TextStyle(color: Color(0xFF6B7280), height: 1.6),
                  ),
                  const SizedBox(height: 12),
                  _buildBulletPoint(
                      'Displaying your profile and user information within the app'),
                  _buildBulletPoint('Managing your conference registration'),
                  _buildBulletPoint(
                      'Sending relevant event notifications and updates'),
                  _buildBulletPoint(
                      'Enabling networking features during the conference'),
                  const SizedBox(height: 16),
                  const Text(
                    'Data Security',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Your data is securely stored and protected with encryption. We do not:',
                    style: TextStyle(color: Color(0xFF6B7280), height: 1.6),
                  ),
                  const SizedBox(height: 12),
                  _buildBulletPoint(
                      'Share your personal data with third parties'),
                  _buildBulletPoint('Use your data for marketing purposes'),
                  _buildBulletPoint('Sell or trade your information'),
                  _buildBulletPoint('Store sensitive payment information'),
                  const SizedBox(height: 16),
                  const Text(
                    'Data Retention',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Your data will be retained for the duration of the conference and can be deleted upon request by contacting support.',
                    style: TextStyle(color: Color(0xFF6B7280), height: 1.6),
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0D7E52),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('I Understand'),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildBulletPoint(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '• ',
            style: TextStyle(color: Color(0xFF6B7280), fontSize: 16),
          ),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                color: Color(0xFF6B7280),
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _confirmLogout(BuildContext context) {
    showDialog(
      context: context,
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
                'Logout',
                style: TextStyle(
                  color: Color(0xFF0D7E52),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          content: const Text(
            'Are you sure you want to logout from your account?',
            style: TextStyle(fontSize: 16),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                'Cancel',
                style: TextStyle(color: Colors.grey[600]),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                Navigator.pushReplacementNamed(context, '/auth');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0D7E52),
                foregroundColor: Colors.white,
              ),
              child: const Text('Logout'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    const themeColor = Color(0xFF0D7E52);

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
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
                  ListTile(
                    leading: const Icon(
                      Icons.notifications,
                      color: Color(0xFF0D7E52),
                    ),
                    title: const Text(
                      'Notifications',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0D7E52),
                      ),
                    ),
                    subtitle: const Text(
                      'Manage event alerts and reminders',
                      style: TextStyle(color: Color(0xFF6B7280), fontSize: 12),
                    ),
                    trailing: Switch(
                      value: _notificationsEnabled,
                      onChanged: _saveNotificationSettings,
                      activeColor: const Color(0xFF0D7E52),
                    ),
                  ),
                  _divider(),
                  _settingTile(
                    'Privacy & Security',
                    'Control your data and privacy settings',
                    Icons.privacy_tip,
                    onTap: () => _showPrivacyPolicy(context),
                  ),
                  _divider(),
                  _settingTile(
                    'Language',
                    'Select app language',
                    Icons.language,
                  ),
                  _divider(),
                  _settingTile(
                    'Help & Support',
                    'Get assistance with your conference app',
                    Icons.help,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
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
                    'Clear Cache',
                    'Free up space on your device',
                    Icons.delete,
                  ),
                  _divider(),
                  _settingTile(
                    'Logout',
                    'Sign out of your account',
                    Icons.logout,
                    isDestructive: true,
                    onTap: () => _confirmLogout(context),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _settingTile(
    String title,
    String subtitle,
    IconData icon, {
    VoidCallback? onTap,
    bool isDestructive = false,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: isDestructive ? Colors.red : const Color(0xFF0D7E52),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: isDestructive ? Colors.red : const Color(0xFF0D7E52),
        ),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(color: Color(0xFF6B7280), fontSize: 12),
      ),
      trailing: Icon(
        Icons.chevron_right,
        color: isDestructive ? Colors.red : const Color(0xFF9CA3AF),
      ),
      onTap: onTap,
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
