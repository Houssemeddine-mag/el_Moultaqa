import 'package:flutter/material.dart';
import '../mobile_config.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  String _countdownText() {
    final nextSession = MobileConfig.scheduleDays
        .expand((day) => day['sessions'] as List<Map<String, String>>)
        .firstWhere(
          (session) => DateTime.parse(
            session['date']! + ' ' + session['time']!,
          ).isAfter(DateTime.now()),
          orElse: () => {},
        );

    if (nextSession.isEmpty) {
      return 'Conference is underway';
    }

    final dateTime = DateTime.parse(
      nextSession['date']! + ' ' + nextSession['time']!,
    );
    final remaining = dateTime.difference(DateTime.now());
    if (remaining.isNegative) return 'Happening now';

    final days = remaining.inDays;
    final hours = remaining.inHours % 24;
    final minutes = remaining.inMinutes % 60;

    return '${days}d ${hours}h ${minutes}m until ${nextSession['title']}';
  }

  @override
  Widget build(BuildContext context) {
    final themeColor = Color(int.parse(MobileConfig.themeColor));

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  MobileConfig.appName,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: themeColor,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: themeColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Text(
                    'LIVE',
                    style: TextStyle(
                      color: themeColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    themeColor.withOpacity(0.18),
                    themeColor.withOpacity(0.05),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    MobileConfig.heroTitle,
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: themeColor,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    MobileConfig.heroSubtitle,
                    style: TextStyle(
                      fontSize: 16,
                      color: themeColor.withOpacity(0.8),
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: [
                      _infoChip(
                        Icons.calendar_today,
                        MobileConfig.conferenceDates,
                      ),
                      _infoChip(Icons.location_on, MobileConfig.location),
                      _infoChip(
                        Icons.people,
                        '${MobileConfig.participants}+ attendees',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 24,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Next session',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            color: themeColor,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _countdownText(),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _statCard('28+', 'Sessions', themeColor),
                _statCard('06', 'Keynotes', themeColor),
                _statCard('18', 'Speakers', themeColor),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              'Upcoming sessions',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: themeColor,
              ),
            ),
            const SizedBox(height: 14),
            Column(
              children: MobileConfig.upcomingSessions.map((session) {
                return _upcomingTile(session, themeColor);
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE6E6F0)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: const Color(0xFF6B7280)),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280)),
          ),
        ],
      ),
    );
  }

  Widget _statCard(String value, String label, Color themeColor) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 24,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: themeColor,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(fontSize: 14, color: Color(0xFF6B7280)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _upcomingTile(Map<String, String> session, Color themeColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 18,
          vertical: 12,
        ),
        title: Text(
          session['title']!,
          style: TextStyle(fontWeight: FontWeight.bold, color: themeColor),
        ),
        subtitle: Text('${session['time']} · ${session['speaker']}'),
        trailing: Icon(Icons.arrow_forward_ios, size: 16, color: themeColor),
      ),
    );
  }
}
