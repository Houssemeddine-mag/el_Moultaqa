import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import '../mobile_config.dart';
import '../services/supabase_service.dart';
import 'keynote_speakers_page.dart';
import 'program_page.dart';

class HomePage extends StatefulWidget {
  final String userRole;
  final VoidCallback? onNavigateToProgram;
  const HomePage({super.key, required this.userRole, this.onNavigateToProgram});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Color themeColor;
  // Sensible placeholder until real org data loads in _loadConferenceData().
  DateTime ceremonyDate = DateTime.now().add(const Duration(days: 30));
  Duration remaining = const Duration();
  Timer? countdownTimer;
  String conferenceStartDate = "";
  String conferenceName = "";
  String conferenceDescription = '';
  String conferenceWebsite = '';
  String conferenceLocation = "";
  int totalParticipants = 0;

  // Placeholder stats
  Map<String, int> programStats = {
    'totalSessions': 0,
    'totalConferences': 0,
    'totalSpeakers': 0,
    'keynoteSessions': 0,
  };

  List<Map<String, dynamic>> upcomingEvents = [];
  Timer? _upcomingTimer;

  @override
  void initState() {
    super.initState();
    _startCountdown();
    _loadConferenceData();
    _loadUpcomingEvents();
    _upcomingTimer = Timer.periodic(
      const Duration(minutes: 1),
      (_) => _loadUpcomingEvents(),
    );
  }

  Future<void> _loadConferenceData() async {
    try {
      if (mounted) {
        setState(() {
          conferenceName = MobileConfig.heroTitle.isNotEmpty ? MobileConfig.heroTitle : MobileConfig.appName;
          conferenceLocation = MobileConfig.location.isNotEmpty ? MobileConfig.location : 'Conference Venue';
          conferenceStartDate = MobileConfig.conferenceDates.isNotEmpty ? MobileConfig.conferenceDates : 'Dates TBD';
          conferenceDescription = MobileConfig.conferenceDescription.isNotEmpty ? MobileConfig.conferenceDescription : 'A premier conference experience.';
          conferenceWebsite = MobileConfig.conferenceWebsite;
          totalParticipants = MobileConfig.participants > 0 ? MobileConfig.participants : 0;

          final parsedCeremonyDate = DateTime.tryParse(MobileConfig.conferenceDates);
          if (parsedCeremonyDate != null) {
            ceremonyDate = parsedCeremonyDate;
          }
        });
      }

      final config = await SupabaseService.getConferenceConfig();
      if (config != null) {
        MobileConfig.loadFromService(SupabaseService.orgDetails, config);
        if (mounted) {
          setState(() {
            final name = config['name']?.toString();
            if (name != null && name.isNotEmpty) conferenceName = name;
            final desc = config['description']?.toString();
            if (desc != null && desc.isNotEmpty) conferenceDescription = desc;
            final loc = config['location']?.toString();
            if (loc != null && loc.isNotEmpty) conferenceLocation = loc;
            final web = config['website']?.toString();
            if (web != null && web.isNotEmpty) conferenceWebsite = web;
            final start = config['startDate']?.toString();
            if (start != null && start.isNotEmpty) {
              conferenceStartDate = start;
              final parsed = DateTime.tryParse(start);
              if (parsed != null) ceremonyDate = parsed;
            }
            if (config['attendees'] is List) {
              totalParticipants = (config['attendees'] as List).length;
            }
          });
        }
      }
    } catch (_) {}
  }

  Future<void> _loadUpcomingEvents() async {
    try {
      List<dynamic> decoded = [];

      try {
        final sessions = await SupabaseService.getSessions();
        decoded = sessions.map((s) {
          final startTimeStr = (s['start_time'] ?? '').toString();
          final endTimeStr = (s['end_time'] ?? '').toString();
          final startDt = DateTime.tryParse(startTimeStr);
          final endDt = DateTime.tryParse(endTimeStr);
          final metadata = s['metadata'] is Map
              ? Map<String, dynamic>.from(s['metadata'] as Map)
              : <String, dynamic>{};

          String dateStr = '';
          String startStr = '';
          String endStr = '';
          if (startDt != null) {
            dateStr =
                '${startDt.year}-${startDt.month.toString().padLeft(2, '0')}-${startDt.day.toString().padLeft(2, '0')}';
            startStr =
                '${startDt.hour.toString().padLeft(2, '0')}:${startDt.minute.toString().padLeft(2, '0')}';
          }
          if (endDt != null) {
            endStr =
                '${endDt.hour.toString().padLeft(2, '0')}:${endDt.minute.toString().padLeft(2, '0')}';
          }

          return {
            'id': s['id'],
            'type': s['session_type'] ?? '',
            'title': s['title'] ?? '',
            'date': dateStr,
            'start': startStr,
            'end': endStr,
            'room': s['room'] ?? '',
            'chairs': metadata['chairs'] is List
                ? List<dynamic>.from(metadata['chairs'] as List)
                : <dynamic>[],
            'keynote': null,
            'keynoteDescription': s['description'] ?? '',
            'conferences': <Map<String, dynamic>>[],
            'streamId': metadata['streamId']?.toString() ?? '',
            'createdAt': s['created_at'] ?? '',
            'updatedAt': s['updated_at'] ?? '',
          };
        }).toList();
      } catch (_) {
        final prefs = await SharedPreferences.getInstance();
        final raw = prefs.getString('elm_webapp_programs');

        if (raw == null || raw.isEmpty) {
          if (mounted) {
            setState(() {
              upcomingEvents = [];
              programStats = {
                'totalSessions': 0,
                'totalConferences': 0,
                'totalSpeakers': 0,
                'keynoteSessions': 0,
              };
            });
          }
          return;
        }

        final d = jsonDecode(raw);
        if (d is! List) return;
        decoded = d;
      }

      final now = DateTime.now();
      final List<Map<String, dynamic>> allUpcoming = [];

      int totalSessions = 0;
      int totalConferences = 0;
      int keynoteSessions = 0;
      final Set<String> speakers = {};

      for (final session in decoded) {
        if (session is! Map) continue;
        final dateStr = (session['date'] ?? '').toString();
        final startStr = (session['start'] ?? '').toString();
        final endStr = (session['end'] ?? '').toString();
        final title = (session['title'] ?? 'Session').toString();
        final room = (session['room'] ?? '').toString();

        if (dateStr.isEmpty || startStr.isEmpty) continue;

        final startDt = DateTime.tryParse('${dateStr}T$startStr');
        final endDt = endStr.isNotEmpty
            ? DateTime.tryParse('${dateStr}T$endStr')
            : startDt;

        if (startDt == null) continue;

        if (endDt != null && endDt.isBefore(now)) continue;

        totalSessions++;

        final conferences = (session['conferences'] as List?)
                ?.whereType<Map>()
                .map((m) => Map<String, dynamic>.from(m))
                .toList() ??
            [];

        if (conferences.isNotEmpty) {
          for (final conf in conferences) {
            final confTitle = (conf['title'] ?? '').toString();
            final speaker = (conf['speaker'] ?? conf['presenter'] ?? '').toString();
            final confStart = (conf['start'] ?? '').toString();
            final confEnd = (conf['end'] ?? '').toString();
            final isKeynote = conf['isKeynote'] == true;

            final confStartDt = confStart.isNotEmpty
                ? DateTime.tryParse('${dateStr}T$confStart')
                : startDt;
            final confEndDt = confEnd.isNotEmpty
                ? DateTime.tryParse('${dateStr}T$confEnd')
                : endDt;

            if (confStartDt != null && confEndDt != null && confEndDt.isBefore(now)) continue;

            if (speaker.isNotEmpty) speakers.add(speaker);
            if (isKeynote) keynoteSessions++;
            totalConferences++;

            final timeStr = confStart.isNotEmpty
                ? (confEnd.isNotEmpty ? '$confStart - $confEnd' : confStart)
                : (startStr.isNotEmpty
                    ? (endStr.isNotEmpty ? '$startStr - $endStr' : startStr)
                    : '');

            allUpcoming.add({
              'title': confTitle.isNotEmpty ? confTitle : title,
              'speaker': speaker.isNotEmpty ? speaker : 'Speaker',
              'time': timeStr,
              'room': room,
              'sortDt': confStartDt ?? startDt,
              'date': dateStr,
            });
          }
        } else {
          final timeStr = startStr.isNotEmpty
              ? (endStr.isNotEmpty ? '$startStr - $endStr' : startStr)
              : '';

          allUpcoming.add({
            'title': title,
            'speaker': (session['chairs'] is List
                    ? (session['chairs'] as List).join(', ')
                    : '')
                .toString(),
            'time': timeStr,
            'room': room,
            'sortDt': startDt,
            'date': dateStr,
          });
        }
      }

      allUpcoming.sort((a, b) {
        final aDt = a['sortDt'] as DateTime;
        final bDt = b['sortDt'] as DateTime;
        return aDt.compareTo(bDt);
      });

      final next3 = allUpcoming.take(3).map((e) {
        return {
          'title': e['title'],
          'speaker': e['speaker'],
          'time': e['time'],
        };
      }).toList();

      if (mounted) {
        setState(() {
          upcomingEvents = next3;
          programStats = {
            'totalSessions': totalSessions,
            'totalConferences': totalConferences,
            'totalSpeakers': speakers.length,
            'keynoteSessions': keynoteSessions,
          };
        });
      }
    } catch (e) {
      // Silently fail
    }
  }

  void _startCountdown() {
    countdownTimer?.cancel();
    countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) {
        setState(() {
          remaining = ceremonyDate.difference(DateTime.now());
          if (remaining.isNegative) {
            countdownTimer?.cancel();
            remaining = Duration.zero;
          }
        });
      }
    });
  }

  String _formatDuration(Duration d) {
    if (d.isNegative || d == Duration.zero) {
      return "00d 00h 00m 00s";
    }
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    return "${twoDigits(d.inDays)}d ${twoDigits(d.inHours % 24)}h ${twoDigits(d.inMinutes % 60)}m ${twoDigits(d.inSeconds % 60)}s";
  }

  String _getCountdownText() {
    if (remaining.isNegative || remaining == Duration.zero) {
      return "The conference is in progress!";
    }
    return "Starting in: ${_formatDuration(remaining)}";
  }

  Future<void> _launchURL(String url) async {
    try {
      final Uri uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Unable to open link: $url'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Error opening link'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  void dispose() {
    countdownTimer?.cancel();
    _upcomingTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    themeColor = MobileConfig.parsedThemeColor;

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            // Hero Section - Full Width Responsive Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: themeColor,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    conferenceName.isNotEmpty ? conferenceName : 'Conference',
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (conferenceDescription.isNotEmpty)
                    Text(
                      conferenceDescription,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white.withOpacity(0.9),
                        height: 1.5,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 16,
                    runSpacing: 12,
                    children: <Widget>[
                      if (conferenceStartDate.isNotEmpty)
                        _iconText(Icons.calendar_today, conferenceStartDate),
                      if (conferenceLocation.isNotEmpty)
                        _iconText(Icons.location_on, conferenceLocation),
                      if (totalParticipants > 0)
                        _iconText(
                            Icons.people, "$totalParticipants+ Participants"),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Text(
                    _getCountdownText(),
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white.withOpacity(0.95),
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 28),
            // Quick Stats
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                Expanded(
                  child: _statCard(
                      programStats['totalConferences']?.toString() ?? "0",
                      "Sessions"),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _statCard(
                      programStats['keynoteSessions']?.toString() ?? "0",
                      "Keynotes"),
                ),
              ],
            ),
            const SizedBox(height: 20),
            // Upcoming Events
            Text(
              "Upcoming Sessions",
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            upcomingEvents.isEmpty
                ? Container(
                    height: 150,
                    decoration: BoxDecoration(
                      color: themeColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Icon(
                            Icons.event_busy,
                            size: 48,
                            color: themeColor,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            "No upcoming sessions",
                            style: TextStyle(
                              fontSize: 16,
                              color: themeColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            "Check the full program",
                            style: TextStyle(
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                : Column(
                    children: upcomingEvents.map((event) {
                      return _buildEventCard(event);
                    }).toList(),
                  ),
            const SizedBox(height: 10),
            // Navigation Buttons
            Row(
              children: <Widget>[
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ElevatedButton(
                      onPressed: () {
                        if (widget.onNavigateToProgram != null) {
                          widget.onNavigateToProgram!();
                        } else {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const ProgramPage(),
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: themeColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: const Text("View full program"),
                    ),
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(left: 8.0),
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const KeynoteSpeakersPage(),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: themeColor,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: const Text("Keynote Speakers"),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            // About Section
            Text(
              "About ${conferenceName.isNotEmpty ? conferenceName : 'Conference'}",
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: themeColor,
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      conferenceDescription.isNotEmpty
                          ? conferenceDescription
                          : "A premier conference bringing together researchers, engineers and practitioners in ${conferenceName.isNotEmpty ? conferenceName : 'Conference'}. Promoting collaboration and innovation with a focus on emerging technologies.",
                      style: const TextStyle(
                        color: Colors.black87,
                        height: 1.4,
                      ),
                    ),
                    if (conferenceWebsite.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      Row(
                        children: <Widget>[
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: () => _launchURL(conferenceWebsite),
                              icon: const Icon(Icons.web, size: 18),
                              label: const Text("Visit website"),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: themeColor,
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 12),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            // Organizer Mode
            if (widget.userRole == 'organizer')
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        "Organizer Mode",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: themeColor,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: <Widget>[
                          _organizerButton("Manage Notifications"),
                          _organizerButton("View Evaluations"),
                          _organizerButton("Manage Live Chat"),
                          _organizerButton("Analytics"),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _iconText(IconData icon, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 16, color: Colors.white),
        const SizedBox(width: 4),
        Flexible(
          child: Text(
            text,
            style: const TextStyle(color: Colors.white),
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }

  Widget _statCard(String value, String label) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: <Widget>[
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: themeColor,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEventCard(Map<String, dynamic> event) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      color: themeColor.withOpacity(0.1),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: themeColor.withOpacity(0.2)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: themeColor,
          child: const Icon(Icons.schedule, color: Colors.white, size: 20),
        ),
        title: Text(
          event['title'] ?? 'Session',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if ((event['speaker'] ?? '').isNotEmpty)
                Row(
                  children: [
                    Icon(Icons.person_outline, size: 14, color: Colors.grey[600]),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        event['speaker'],
                        style: TextStyle(color: Colors.grey[700], fontSize: 13),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              if ((event['time'] ?? '').isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: Row(
                    children: [
                      Icon(Icons.access_time, size: 14, color: Colors.grey[600]),
                      const SizedBox(width: 4),
                      Text(
                        event['time'],
                        style: TextStyle(color: Colors.grey[600], fontSize: 13),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
        trailing: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: themeColor.withOpacity(0.15),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(Icons.arrow_forward_ios, size: 14, color: themeColor),
        ),
        onTap: () => _showEventDetailDialog(event),
      ),
    );
  }

  void _showEventDetailDialog(Map<String, dynamic> event) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          event['title'] ?? 'Session',
          style: TextStyle(color: themeColor, fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if ((event['speaker'] ?? '').toString().isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Row(
                  children: [
                    Icon(Icons.person_outline, size: 16, color: Colors.grey[600]),
                    const SizedBox(width: 6),
                    Expanded(child: Text(event['speaker'])),
                  ],
                ),
              ),
            if ((event['time'] ?? '').toString().isNotEmpty)
              Row(
                children: [
                  Icon(Icons.access_time, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 6),
                  Text(event['time']),
                ],
              ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              if (widget.onNavigateToProgram != null) {
                widget.onNavigateToProgram!();
              } else {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ProgramPage()),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: themeColor,
              foregroundColor: Colors.white,
            ),
            child: const Text('View full program'),
          ),
        ],
      ),
    );
  }

  Widget _organizerButton(String label) {
    void onPressed() {
      if (label == "Manage Notifications") {
        Navigator.pushNamed(context, '/admin-notif');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('$label — coming soon')),
        );
      }
    }

    return ActionChip(
      label: Text(label),
      backgroundColor: themeColor.withValues(alpha: 0.1),
      labelStyle: TextStyle(color: themeColor),
      side: BorderSide(color: themeColor),
      onPressed: onPressed,
    );
  }
}
