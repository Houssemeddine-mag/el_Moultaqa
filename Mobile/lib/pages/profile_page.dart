import 'package:flutter/material.dart';
import '../mobile_config.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

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

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Profile',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: themeColor,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: themeColor.withOpacity(0.16),
                        child: Text(
                          'E',
                          style: TextStyle(
                            color: themeColor,
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'ElMoultaqa User',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'attendee@example.com',
                            style: TextStyle(color: Color(0xFF6B7280)),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _profileRow('Company', 'ElMoultaqa Events'),
                  const SizedBox(height: 16),
                  _profileRow('Role', 'Attendee'),
                  const SizedBox(height: 16),
                  _profileRow('Conference', 'December Edition'),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Account settings',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: themeColor,
              ),
            ),
            const SizedBox(height: 16),
            _settingTile('Manage notifications', themeColor),
            const SizedBox(height: 12),
            _settingTile('Privacy preferences', themeColor),
            const SizedBox(height: 12),
            _settingTile('Language', themeColor),
          ],
        ),
      ),
    );
  }

  Widget _profileRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Color(0xFF6B7280))),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
      ],
    );
  }

  Widget _settingTile(String title, Color themeColor) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ListTile(
        title: Text(
          title,
          style: TextStyle(color: themeColor, fontWeight: FontWeight.w600),
        ),
        trailing: const Icon(Icons.chevron_right, color: Color(0xFF9CA3AF)),
      ),
    );
  }
}
