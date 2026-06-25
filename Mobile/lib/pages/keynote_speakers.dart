import 'package:flutter/material.dart';
import '../mobile_config.dart';

class KeynoteSpeakersPage extends StatelessWidget {
  const KeynoteSpeakersPage({super.key});

  // Sample local list — mirrors rifrif content but without Firebase
  List<Map<String, String>> _speakers() {
    return [
      {
        'name': 'Nadia Amrani',
        'title': 'Scaling for Impact',
        'institution': 'University of Algiers',
        'biography':
            'Nadia is a researcher and practitioner focused on scalable community events and hybrid experiences.',
        'image': ''
      },
      {
        'name': 'Samir Belkacem',
        'title': 'Tomorrow\'s Events',
        'institution': 'EventLab',
        'biography':
            'Samir leads product and event strategy across digital and physical platforms.',
        'image': ''
      },
    ];
  }

  Widget _buildSpeakerCard(Map<String, String> s, BuildContext context) {
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff${raw.substring(1)}';
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff$raw';
    }
    final themeColor = Color(int.parse(hex));
    return GestureDetector(
      onTap: () => _showBio(context, s),
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: ListTile(
          contentPadding: const EdgeInsets.all(16),
          leading: CircleAvatar(
            radius: 28,
            backgroundColor: themeColor.withOpacity(0.12),
            child: const Icon(Icons.person, color: Colors.grey),
          ),
          title: Text(s['name'] ?? 'Unknown',
              style: TextStyle(color: themeColor, fontWeight: FontWeight.bold)),
          subtitle: Text('${s['title']} · ${s['institution']}'),
          trailing: const Icon(Icons.chevron_right),
        ),
      ),
    );
  }

  void _showBio(BuildContext context, Map<String, String> speaker) {
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff${raw.substring(1)}';
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff$raw';
    }
    final themeColor = Color(int.parse(hex));
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                CircleAvatar(
                    radius: 44,
                    backgroundColor: themeColor.withOpacity(0.12),
                    child: const Icon(Icons.person, size: 44)),
                const SizedBox(height: 16),
                Text(speaker['name'] ?? '',
                    style: const TextStyle(
                        fontSize: 20, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Text(speaker['title'] ?? '',
                    style: const TextStyle(fontSize: 14, color: Colors.grey)),
                const SizedBox(height: 16),
                Text(speaker['biography'] ?? '', textAlign: TextAlign.justify),
                const SizedBox(height: 12),
                ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Close')),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff${raw.substring(1)}';
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff$raw';
    }
    final themeColor = Color(int.parse(hex));
    final speakers = _speakers();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Keynote Speakers'),
        backgroundColor: Colors.white,
        foregroundColor: themeColor,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: speakers.isEmpty
            ? const Center(child: Text('No keynote speakers found.'))
            : ListView.builder(
                itemCount: speakers.length,
                itemBuilder: (context, index) =>
                    _buildSpeakerCard(speakers[index], context),
              ),
      ),
    );
  }
}
