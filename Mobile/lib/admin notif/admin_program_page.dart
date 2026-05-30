import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AdminProgramPage extends StatefulWidget {
  final Color themeColor;
  const AdminProgramPage({super.key, required this.themeColor});

  @override
  State<AdminProgramPage> createState() => _AdminProgramPageState();
}

class _AdminProgramPageState extends State<AdminProgramPage> {
  List<Map<String, dynamic>> _programs = <Map<String, dynamic>>[];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPrograms();
  }

  Future<void> _loadPrograms() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('elm_webapp_programs');
    if (!mounted) return;

    if (raw == null || raw.isEmpty) {
      setState(() {
        _programs = <Map<String, dynamic>>[];
        _loading = false;
      });
      return;
    }

    try {
      final decoded = jsonDecode(raw);
      final items = decoded is List
          ? decoded.whereType<Map>().map((item) {
              return Map<String, dynamic>.from(item);
            }).toList()
          : <Map<String, dynamic>>[];

      items.sort((a, b) {
        final dateCompare = (a['date'] ?? '')
            .toString()
            .compareTo((b['date'] ?? '').toString());
        if (dateCompare != 0) return dateCompare;
        return (a['start'] ?? '')
            .toString()
            .compareTo((b['start'] ?? '').toString());
      });

      setState(() {
        _programs = items;
        _loading = false;
      });
    } catch (_) {
      setState(() {
        _programs = <Map<String, dynamic>>[];
        _loading = false;
      });
    }
  }

  Widget _emptyProgramState() {
    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
        side: BorderSide(color: Colors.grey.withValues(alpha: 0.12)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Row(
          children: <Widget>[
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: widget.themeColor.withValues(alpha: 0.10),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                Icons.calendar_today_outlined,
                color: widget.themeColor,
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    'No program available yet',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[850],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Once the schedule is published from the conference template, the full agenda will appear here.',
                    style: TextStyle(
                      color: Colors.grey[600],
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Map<String, List<Map<String, dynamic>>> _groupPrograms() {
    final grouped = <String, List<Map<String, dynamic>>>{};
    for (final program in _programs) {
      final date = (program['date'] ?? 'TBA').toString();
      grouped.putIfAbsent(date, () => <Map<String, dynamic>>[]).add(program);
    }
    return grouped;
  }

  @override
  Widget build(BuildContext context) {
    final grouped = _groupPrograms();
    final dates = grouped.keys.toList()..sort();
    final totalSessions = _programs.length;
    final totalPresentations = _programs.fold<int>(
      0,
      (sum, item) => sum + (((item['conferences'] as List?)?.length) ?? 0),
    );

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: _loading
            ? const Center(
                child: Padding(
                  padding: EdgeInsets.only(top: 100),
                  child: CircularProgressIndicator(),
                ),
              )
            : Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: widget.themeColor,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        const Text(
                          'Conference Program',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 10),
                        const Text(
                          'Review the conference schedule used across the attendee web app.',
                          style: TextStyle(color: Colors.white, height: 1.4),
                        ),
                        const SizedBox(height: 18),
                        Wrap(
                          spacing: 12,
                          runSpacing: 12,
                          children: <Widget>[
                            _chip('Days', dates.length.toString()),
                            _chip('Sessions', totalSessions.toString()),
                            _chip(
                                'Presentations', totalPresentations.toString()),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  if (_programs.isEmpty)
                    _emptyProgramState()
                  else
                    ...dates.map((date) {
                      final sessions =
                          grouped[date] ?? <Map<String, dynamic>>[];
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Padding(
                            padding: const EdgeInsets.only(bottom: 10),
                            child: Text(
                              date,
                              style: Theme.of(context)
                                  .textTheme
                                  .titleLarge
                                  ?.copyWith(
                                    color: widget.themeColor,
                                    fontWeight: FontWeight.bold,
                                  ),
                            ),
                          ),
                          ...sessions.map((session) {
                            final conferences =
                                (session['conferences'] as List?)
                                        ?.whereType<Map>()
                                        .map((item) =>
                                            Map<String, dynamic>.from(item))
                                        .toList() ??
                                    <Map<String, dynamic>>[];

                            return Card(
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: <Widget>[
                                    Row(
                                      children: <Widget>[
                                        Expanded(
                                          child: Text(
                                            (session['title'] ?? 'Session')
                                                .toString(),
                                            style: const TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 10,
                                            vertical: 6,
                                          ),
                                          decoration: BoxDecoration(
                                            color: widget.themeColor
                                                .withValues(alpha: 0.12),
                                            borderRadius:
                                                BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            (session['room'] ?? '').toString(),
                                            style: TextStyle(
                                              color: widget.themeColor,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      '${(session['start'] ?? '').toString()}${(session['end'] ?? '').toString().isNotEmpty ? ' - ${session['end']}' : ''}',
                                      style: const TextStyle(
                                          color: Colors.black54),
                                    ),
                                    if (conferences.isNotEmpty) ...<Widget>[
                                      const SizedBox(height: 12),
                                      const Text(
                                        'Presentations',
                                        style: TextStyle(
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      ...conferences.map((conference) {
                                        return Padding(
                                          padding:
                                              const EdgeInsets.only(bottom: 8),
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
                                              children: <Widget>[
                                                Text(
                                                  (conference['title'] ??
                                                          'Presentation')
                                                      .toString(),
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Text(
                                                  '${(conference['time'] ?? conference['start'] ?? '').toString()}${(conference['speaker'] ?? '').toString().isNotEmpty ? ' • ${(conference['speaker'])}' : ''}',
                                                  style: const TextStyle(
                                                      color: Colors.black54),
                                                ),
                                              ],
                                            ),
                                          ),
                                        );
                                      }),
                                    ],
                                  ],
                                ),
                              ),
                            );
                          }),
                          const SizedBox(height: 16),
                        ],
                      );
                    }),
                ],
              ),
      ),
    );
  }

  Widget _chip(String label, String value) {
    return Chip(
      label:
          Text('$label: $value', style: const TextStyle(color: Colors.white)),
      backgroundColor: Colors.white.withValues(alpha: 0.16),
      side: BorderSide(color: Colors.white.withValues(alpha: 0.24)),
    );
  }
}
