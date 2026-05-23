import 'package:flutter/material.dart';
import '../mobile_config.dart';
import 'presentation_feedback.dart';

class ProgramPage extends StatelessWidget {
  const ProgramPage({super.key});

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
    final scheduleDays = MobileConfig.scheduleDays;

    return SafeArea(
      child: DefaultTabController(
        length: scheduleDays.length,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Program',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: themeColor,
                    ),
                  ),
                  Text(
                    MobileConfig.conferenceDates,
                    style: const TextStyle(color: Color(0xFF6B7280)),
                  ),
                ],
              ),
            ),
            TabBar(
              indicatorColor: themeColor,
              labelColor: themeColor,
              unselectedLabelColor: const Color(0xFF9CA3AF),
              tabs: scheduleDays
                  .map((day) => Tab(text: day['label'] as String))
                  .toList(),
            ),
            Expanded(
              child: TabBarView(
                children: scheduleDays.map((day) {
                  final sessions = day['sessions'] as List<Map<String, String>>;
                  return ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 20, 16, 20),
                    itemCount: sessions.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final session = sessions[index];
                      return Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
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
                            vertical: 16,
                          ),
                          title: Text(
                            session['title']!,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: themeColor,
                            ),
                          ),
                          subtitle: Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              '${session['time']} • ${session['speaker']}',
                              style: const TextStyle(color: Color(0xFF6B7280)),
                            ),
                          ),
                          onTap: () {
                            // Open feedback for this session
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => PresentationFeedbackPage(
                                    title: session['title'] ?? 'Feedback'),
                              ),
                            );
                          },
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: themeColor.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  session['room']!,
                                  style: TextStyle(
                                    color: themeColor,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
