import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../mobile_config.dart';
import 'presentation_feedback.dart';

class ProgramPage extends StatefulWidget {
  const ProgramPage({super.key});

  @override
  State<ProgramPage> createState() => _ProgramPageState();
}

class _ProgramPageState extends State<ProgramPage>
    with SingleTickerProviderStateMixin {
  List<Map<String, dynamic>> _programs = [];
  bool _loading = true;
  TabController? _tabController;
  Color _themeColor = const Color(0xFF0D7E52);
  List<String> _dates = [];

  @override
  void initState() {
    super.initState();
    _parseThemeColor();
    _loadPrograms();
  }

  void _parseThemeColor() {
    String raw = MobileConfig.themeColor ?? '0xFF0D7E52';
    String hex;
    if (raw.startsWith('#')) {
      hex = '0xff${raw.substring(1)}';
    } else if (raw.startsWith('0x')) {
      hex = raw;
    } else {
      hex = '0xff$raw';
    }
    _themeColor = Color(int.parse(hex));
  }

  Future<void> _loadPrograms() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('elm_webapp_programs');

      if (raw == null || raw.isEmpty) {
        if (mounted) {
          setState(() => _loading = false);
        }
        return;
      }

      final decoded = jsonDecode(raw);
      if (decoded is! List) {
        if (mounted) {
          setState(() => _loading = false);
        }
        return;
      }

      final programs = decoded
          .whereType<Map>()
          .map((m) => Map<String, dynamic>.from(m))
          .toList();

      programs.sort((a, b) {
        final dateCompare = (a['date'] ?? '')
            .toString()
            .compareTo((b['date'] ?? '').toString());
        if (dateCompare != 0) return dateCompare;
        return (a['start'] ?? '')
            .toString()
            .compareTo((b['start'] ?? '').toString());
      });

      final dates = <String>[];
      for (final p in programs) {
        final d = (p['date'] ?? '').toString();
        if (d.isNotEmpty && !dates.contains(d)) {
          dates.add(d);
        }
      }

      if (mounted) {
        setState(() {
          _programs = programs;
          _dates = dates;
          _loading = false;
          _tabController?.dispose();
          if (dates.isNotEmpty) {
            _tabController = TabController(length: dates.length, vsync: this);
          }
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  void dispose() {
    _tabController?.dispose();
    super.dispose();
  }

  String _formatDate(String dateStr) {
    final dt = DateTime.tryParse(dateStr);
    if (dt == null) return dateStr;
    const months = [
      '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${months[dt.month]} ${dt.day}';
  }

  int _countTotalSessions() {
    return _programs.length;
  }

  int _countTotalConferences() {
    int count = 0;
    for (final p in _programs) {
      final confs = (p['conferences'] as List?)?.length ?? 0;
      count += confs > 0 ? confs : 1;
    }
    return count;
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(color: _themeColor),
                const SizedBox(height: 16),
                Text(
                  'Loading program...',
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (_programs.isEmpty) {
      return Scaffold(
        body: SafeArea(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.calendar_today,
                  size: 64,
                  color: Colors.grey[400],
                ),
                const SizedBox(height: 16),
                Text(
                  'No program available',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'The conference schedule will be available soon',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Scaffold(
      body: SafeArea(
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
                      color: _themeColor,
                    ),
                  ),
                   Text(
                    MobileConfig.conferenceDates,
                    style: TextStyle(color: Color(0xFF6B7280)),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: _statCard(
                      _dates.length.toString(),
                      'Days',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _statCard(
                      _countTotalSessions().toString(),
                      'Sessions',
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _statCard(
                      _countTotalConferences().toString(),
                      'Presentations',
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            if (_tabController != null)
              TabBar(
                controller: _tabController,
                indicatorColor: _themeColor,
                labelColor: _themeColor,
                unselectedLabelColor: const Color(0xFF9CA3AF),
                tabs: _dates.map((d) => Tab(text: _formatDate(d))).toList(),
              ),
            if (_tabController != null)
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: _dates.map((date) {
                    final dayPrograms = _programs
                        .where((p) => (p['date'] ?? '').toString() == date)
                        .toList();
                    return ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 20, 16, 20),
                      itemCount: dayPrograms.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final session = dayPrograms[index];
                        final title =
                            (session['title'] ?? 'Session').toString();
                        final start =
                            (session['start'] ?? '').toString();
                        final end = (session['end'] ?? '').toString();
                        final timeStr = start.isNotEmpty
                            ? (end.isNotEmpty ? '$start - $end' : start)
                            : '';
                        final room =
                            (session['room'] ?? '').toString();
                        final chairs = (session['chairs'] as List?)
                                ?.join(', ') ??
                            '';
                        final conferences = (session['conferences'] as List?)
                                ?.whereType<Map>()
                                .map((m) => Map<String, dynamic>.from(m))
                                .toList() ??
                            [];

                        final subtitleParts = <String>[
                          if (timeStr.isNotEmpty) timeStr,
                          if (room.isNotEmpty) room,
                        ];
                        final subtitle = subtitleParts.join(' • ');

                        return Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.04),
                                blurRadius: 20,
                                offset: const Offset(0, 8),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              ListTile(
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 18,
                                  vertical: 12,
                                ),
                                title: Text(
                                  title,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: _themeColor,
                                    fontSize: 16,
                                  ),
                                ),
                                subtitle: subtitle.isNotEmpty
                                    ? Padding(
                                        padding: const EdgeInsets.only(top: 4),
                                        child: Text(
                                          subtitle,
                                          style: const TextStyle(
                                            color: Color(0xFF6B7280),
                                            fontSize: 13,
                                          ),
                                        ),
                                      )
                                    : null,
                                trailing: room.isNotEmpty
                                    ? Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 10,
                                          vertical: 6,
                                        ),
                                        decoration: BoxDecoration(
                                          color:
                                              _themeColor.withValues(alpha: 0.12),
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                        child: Text(
                                          room,
                                          style: TextStyle(
                                            color: _themeColor,
                                            fontWeight: FontWeight.w600,
                                            fontSize: 12,
                                          ),
                                        ),
                                      )
                                    : null,
                              ),
                              if (conferences.isNotEmpty)
                                Padding(
                                  padding: const EdgeInsets.fromLTRB(
                                      18, 0, 18, 12),
                                  child: Column(
                                    children: conferences.map((conf) {
                                      final confTitle =
                                          (conf['title'] ?? '').toString();
                                      final speaker = (conf['speaker'] ??
                                              conf['presenter'] ??
                                              '')
                                          .toString();
                                      final confStart =
                                          (conf['start'] ?? '').toString();
                                      final confEnd =
                                          (conf['end'] ?? '').toString();
                                      final confTime = confStart.isNotEmpty
                                          ? (confEnd.isNotEmpty
                                              ? '$confStart - $confEnd'
                                              : confStart)
                                          : '';

                                      return Padding(
                                        padding:
                                            const EdgeInsets.only(bottom: 8),
                                        child: InkWell(
                                          borderRadius:
                                              BorderRadius.circular(12),
                                          onTap: () {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder: (context) =>
                                                    PresentationFeedbackPage(
                                                  title: confTitle.isNotEmpty
                                                      ? confTitle
                                                      : title,
                                                ),
                                              ),
                                            );
                                          },
                                          child: Container(
                                            width: double.infinity,
                                            padding: const EdgeInsets.all(12),
                                            decoration: BoxDecoration(
                                              color: Colors.grey
                                                  .withValues(alpha: 0.08),
                                              borderRadius:
                                                  BorderRadius.circular(12),
                                            ),
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Row(
                                                  children: [
                                                    Expanded(
                                                      child: Text(
                                                        confTitle.isNotEmpty
                                                            ? confTitle
                                                            : 'Presentation',
                                                        style: const TextStyle(
                                                          fontWeight:
                                                              FontWeight.w600,
                                                          fontSize: 14,
                                                        ),
                                                      ),
                                                    ),
                                                    if (confTime.isNotEmpty)
                                                      Text(
                                                        confTime,
                                                        style: const TextStyle(
                                                          color:
                                                              Color(0xFF6B7280),
                                                          fontSize: 12,
                                                        ),
                                                      ),
                                                  ],
                                                ),
                                                if (speaker.isNotEmpty)
                                                  Padding(
                                                    padding:
                                                        const EdgeInsets.only(
                                                            top: 4),
                                                    child: Row(
                                                      children: [
                                                        Icon(
                                                          Icons.person_outline,
                                                          size: 14,
                                                          color:
                                                              Colors.grey[600],
                                                        ),
                                                        const SizedBox(width: 4),
                                                        Text(
                                                          speaker,
                                                          style:
                                                              const TextStyle(
                                                            color:
                                                                Color(0xFF6B7280),
                                                            fontSize: 13,
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                  ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ),
                              if (chairs.isNotEmpty)
                                Padding(
                                  padding: const EdgeInsets.fromLTRB(
                                      18, 0, 18, 12),
                                  child: Row(
                                    children: [
                                      Icon(Icons.group,
                                          size: 14, color: Colors.grey[600]),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Chairs: $chairs',
                                        style: const TextStyle(
                                          color: Color(0xFF6B7280),
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                            ],
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

  Widget _statCard(String value, String label) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: _themeColor,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }
}
