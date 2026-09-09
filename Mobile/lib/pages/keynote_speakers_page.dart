import 'dart:convert';

import 'package:flutter/material.dart';

import '../mobile_config.dart';
import '../services/supabase_service.dart';

class KeynoteSpeakersPage extends StatefulWidget {
  const KeynoteSpeakersPage({super.key});

  @override
  State<KeynoteSpeakersPage> createState() => _KeynoteSpeakersPageState();
}

class _KeynoteSpeakersPageState extends State<KeynoteSpeakersPage> {
  final List<Map<String, dynamic>> speakers = [];
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    loadKeynoteSpeakers();
  }

  Future<void> loadKeynoteSpeakers() async {
    setState(() {
      isLoading = true;
    });
    try {
      final data = await SupabaseService.getSpeakers();
      if (!mounted) return;
      setState(() {
        speakers.clear();
        speakers.addAll(data.map((s) {
          final rawImage = s['avatar_url']?.toString() ??
              s['photo']?.toString() ??
              s['image_url']?.toString() ??
              s['image']?.toString() ??
              '';
          return <String, dynamic>{
            'id': s['id']?.toString() ?? '',
            'name': s['full_name']?.toString() ?? s['name']?.toString() ?? 'Speaker',
            'title': s['title']?.toString() ?? s['topic']?.toString() ?? s['role']?.toString() ?? 'Presenter',
            'institution': s['affiliation']?.toString() ?? s['institution']?.toString() ?? '',
            'biography': s['bio']?.toString() ?? s['biography']?.toString() ?? '',
            'imageData': rawImage,
            'image': rawImage,
          };
        }));
        isLoading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        isLoading = false;
      });
    }
  }

  Widget _buildSpeakerImage(String? imageData) {
    final img = (imageData ?? '').trim();
    if (img.isEmpty) {
      return Container(
        color: MobileConfig.parsedThemeColor.withValues(alpha: 0.1),
        child: Icon(
          Icons.person_rounded,
          size: 70,
          color: MobileConfig.parsedThemeColor,
        ),
      );
    }
    // HTTP(S) URL
    if (img.startsWith('http://') || img.startsWith('https://')) {
      return Image.network(
        img,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => Container(
          color: MobileConfig.parsedThemeColor.withValues(alpha: 0.1),
          child: Icon(Icons.person_rounded, size: 70, color: MobileConfig.parsedThemeColor),
        ),
      );
    }
    // Data URI or raw base64 (user confirmed backend uses base64 for some images)
    try {
      String base64Str = img;
      if (img.contains(',')) {
        base64Str = img.split(',').last;
      }
      // Heuristic: base64 is long and only base64 chars
      if (base64Str.length > 100) {
        final bytes = base64Decode(base64Str);
        return Image.memory(
          bytes,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => Container(
            color: MobileConfig.parsedThemeColor.withValues(alpha: 0.1),
            child: Icon(Icons.person_rounded, size: 70, color: MobileConfig.parsedThemeColor),
          ),
        );
      }
    } catch (_) {}
    // Fallback — try as network anyway, else icon
    if (img.startsWith('data:image')) {
      try {
        final base64Str = img.split(',').last;
        final bytes = base64Decode(base64Str);
        return Image.memory(bytes, fit: BoxFit.cover);
      } catch (_) {}
    }
    return Container(
      color: MobileConfig.parsedThemeColor.withValues(alpha: 0.1),
      child: Icon(
        Icons.person_rounded,
        size: 70,
        color: MobileConfig.parsedThemeColor,
      ),
    );
  }

  void _showBioDialog(BuildContext context, Map<String, dynamic> speaker) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.all(20),
          child: Stack(
            clipBehavior: Clip.none,
            alignment: Alignment.topCenter,
            children: [
              // Main Card Content
              Container(
                margin: const EdgeInsets.only(top: 80),
                constraints: BoxConstraints(
                  maxHeight: MediaQuery.of(context).size.height * 0.72,
                ),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.12),
                      blurRadius: 30,
                      offset: const Offset(0, 15),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Close button
                    Align(
                      alignment: Alignment.topRight,
                      child: Padding(
                        padding: const EdgeInsets.all(10),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            onTap: () => Navigator.of(context).pop(),
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.grey[100],
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Icon(
                                Icons.close,
                                color: Colors.grey[600],
                                size: 20,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 35),

                    // Speaker Name
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 28),
                      child: Text(
                        speaker['name'] ?? 'Unknown Speaker',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 23,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF2d2d2d),
                          letterSpacing: 0.5,
                          height: 1.3,
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // Title
                    if (speaker['title'] != null && speaker['title'].isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 28),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: MobileConfig.parsedThemeColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(
                                Icons.school_rounded,
                                size: 16,
                                color: MobileConfig.parsedThemeColor,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Flexible(
                              child: Text(
                                speaker['title'],
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.grey[700],
                                  letterSpacing: 0.3,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    const SizedBox(height: 12),

                    // Institution
                    if (speaker['institution'] != null &&
                        speaker['institution'].isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 28),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: MobileConfig.parsedThemeColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Icon(
                                Icons.apartment_rounded,
                                size: 16,
                                color: MobileConfig.parsedThemeColor,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Flexible(
                              child: Text(
                                speaker['institution'],
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.grey[700],
                                  letterSpacing: 0.3,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    const SizedBox(height: 24),

                    // Divider
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40),
                      child: Container(
                        height: 0.5,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Colors.transparent,
                              Colors.grey.withOpacity(0.3),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Biography section
                    Flexible(
                      child: SingleChildScrollView(
                        physics: const BouncingScrollPhysics(),
                        padding: const EdgeInsets.symmetric(horizontal: 28),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: MobileConfig.parsedThemeColor
                                        .withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    Icons.person_outline_rounded,
                                    size: 16,
                                    color: MobileConfig.parsedThemeColor,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Text(
                                  'About',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: MobileConfig.parsedThemeColor,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),
                            Text(
                              speaker['biography'] ?? 'No biography available.',
                              style: TextStyle(
                                fontSize: 14.5,
                                height: 1.8,
                                color: Colors.grey[800],
                                letterSpacing: 0.2,
                              ),
                              textAlign: TextAlign.left,
                            ),
                            const SizedBox(height: 24),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Profile Picture
              Positioned(
                top: 10,
                child: Container(
                  width: 130,
                  height: 130,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: MobileConfig.parsedThemeColor.withOpacity(0.25),
                        blurRadius: 25,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Colors.white,
                        width: 5,
                      ),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: MobileConfig.parsedThemeColor.withOpacity(0.3),
                          width: 1.5,
                        ),
                      ),
                      child: ClipOval(
                        child: _buildSpeakerImage(speaker['imageData']),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Keynote Speakers',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: MobileConfig.parsedThemeColor,
        iconTheme: const IconThemeData(color: Colors.white),
        elevation: 0,
      ),
      body: isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: MobileConfig.parsedThemeColor,
              ),
            )
          : speakers.isEmpty
              ? const Center(
                  child: Text(
                    'No keynote speakers available yet.',
                    style: TextStyle(fontSize: 16),
                  ),
                )
              : RefreshIndicator(
                  color: MobileConfig.parsedThemeColor,
                  onRefresh: loadKeynoteSpeakers,
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: speakers.length,
                    itemBuilder: (context, index) {
                      final speaker = speakers[index];
                      return Container(
                        margin: const EdgeInsets.only(bottom: 20),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.white,
                              MobileConfig.parsedThemeColor.withOpacity(0.08),
                            ],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withOpacity(0.3),
                              spreadRadius: 2,
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            children: [
                              // Profile Picture
                              Container(
                                width: 120,
                                height: 120,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: MobileConfig.parsedThemeColor,
                                    width: 3,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: MobileConfig.parsedThemeColor
                                          .withOpacity(0.3),
                                      spreadRadius: 2,
                                      blurRadius: 8,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: ClipOval(
                                  child:
                                      _buildSpeakerImage(speaker['imageData']),
                                ),
                              ),
                              const SizedBox(height: 20),

                              // Speaker Name
                              Text(
                                speaker['name'] ?? 'Unknown Speaker',
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: MobileConfig.parsedThemeColor,
                                ),
                              ),
                              const SizedBox(height: 8),

                              // Title
                              if (speaker['title'] != null &&
                                  speaker['title'].isNotEmpty)
                                Text(
                                  speaker['title'],
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.grey[700],
                                  ),
                                ),
                              const SizedBox(height: 12),

                              // Institution
                              if (speaker['institution'] != null &&
                                  speaker['institution'].isNotEmpty)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 8),
                                  decoration: BoxDecoration(
                                    color: MobileConfig.parsedThemeColor
                                        .withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    speaker['institution'],
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w500,
                                      color: MobileConfig.parsedThemeColor,
                                    ),
                                  ),
                                ),
                              const SizedBox(height: 24),

                              // Bio Button
                              ElevatedButton.icon(
                                onPressed: () =>
                                    _showBioDialog(context, speaker),
                                icon: const Icon(Icons.person,
                                    color: Colors.white),
                                label: const Text(
                                  'Read Bio',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.white,
                                  ),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: MobileConfig.parsedThemeColor,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 32, vertical: 16),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30),
                                  ),
                                  elevation: 4,
                                  shadowColor: MobileConfig.parsedThemeColor
                                      .withOpacity(0.4),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
    );
  }
}