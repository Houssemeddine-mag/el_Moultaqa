import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:async';
import '../mobile_config.dart';
import 'program_page.dart';
import 'keynote_speakers_page.dart';

class HomePage extends StatefulWidget {
  final String userRole;
  const HomePage({super.key, required this.userRole});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late Color themeColor;
  DateTime ceremonyDate = DateTime(2025, 12, 8, 9, 0);
  Duration remaining = const Duration();
  Timer? countdownTimer;
  String conferenceStartDate = "";
  String conferenceName = "";
  String conferenceDescription = '';
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

  @override
  void initState() {
    super.initState();
    _startCountdown();
    _loadConferenceData();
  }

  Future<void> _loadConferenceData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final config = prefs.getString('elm_conference_config');

      setState(() {
        // Use MobileConfig values as defaults
        conferenceName = MobileConfig.heroTitle.isNotEmpty
            ? MobileConfig.heroTitle
            : 'Conference';
        conferenceLocation = MobileConfig.location.isNotEmpty
            ? MobileConfig.location
            : 'Conference Venue';
        conferenceStartDate = MobileConfig.conferenceDates.isNotEmpty
            ? MobileConfig.conferenceDates
            : 'Dates TBD';
        conferenceDescription = MobileConfig.conferenceDescription.isNotEmpty
            ? MobileConfig.conferenceDescription
            : 'A premier conference experience.';
        totalParticipants =
            MobileConfig.participants > 0 ? MobileConfig.participants : 0;
      });

      // Override with localStorage data if available
      if (config != null) {
        setState(() {
          // Parse conference name from elm_conference_config
          final nameMatch =
              RegExp(r'"name"\s*:\s*"([^"]*)"').firstMatch(config);
          if (nameMatch != null && nameMatch.group(1)!.isNotEmpty) {
            conferenceName = nameMatch.group(1)!;
          }

          // Parse description
          final descMatch =
              RegExp(r'"description"\s*:\s*"([^"]*)"').firstMatch(config);
          if (descMatch != null && descMatch.group(1)!.isNotEmpty) {
            conferenceDescription = descMatch.group(1) ?? conferenceDescription;
          }
        });
      }
    } catch (e) {
      // Use MobileConfig defaults
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
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Parse theme color from config
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff${raw.substring(1)}';
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff$raw';
    }
    themeColor = Color(int.parse(hex));

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
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const ProgramPage(),
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
                    const SizedBox(height: 16),
                    Row(
                      children: <Widget>[
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () =>
                                _launchURL('https://conference.example.com'),
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
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: themeColor,
          child: const Icon(Icons.person, color: Colors.white),
        ),
        title: Text(
          event['title'] ?? 'Session',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("By ${event['speaker'] ?? 'Speaker'}"),
            Text(event['time'] ?? ''),
          ],
        ),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () {},
      ),
    );
  }

  Widget _organizerButton(String label) {
    return Chip(
      label: Text(label),
      backgroundColor: themeColor.withOpacity(0.1),
      labelStyle: TextStyle(color: themeColor),
      side: BorderSide(color: themeColor),
    );
  }
}
