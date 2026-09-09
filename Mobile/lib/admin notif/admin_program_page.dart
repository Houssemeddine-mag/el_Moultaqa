import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../services/supabase_service.dart';
import 'models.dart';
import 'storage.dart';

class AdminProgramPage extends StatefulWidget {
  final Color themeColor;
  const AdminProgramPage({super.key, required this.themeColor});

  @override
  State<AdminProgramPage> createState() => _AdminProgramPageState();
}

class _AdminProgramPageState extends State<AdminProgramPage> {
  List<Map<String, dynamic>> _programs = <Map<String, dynamic>>[];
  List<LiveStream> _streams = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await Future.wait([_loadPrograms(), _loadStreams()]);
  }

  Future<void> _loadStreams() async {
    try {
      final raw = await SupabaseService.getStreams();
      if (mounted) {
        setState(() {
          _streams = raw
              .map((s) => LiveStream(
                    id: s['id']?.toString() ?? '',
                    name: s['name']?.toString() ?? '',
                    url: s['url']?.toString() ?? '',
                    createdAt: DateTime.tryParse(
                            s['createdAt']?.toString() ?? '') ??
                        DateTime.now(),
                  ))
              .toList();
        });
      }
    } catch (_) {
      if (mounted) setState(() => _streams = []);
    }
  }

  Future<void> _savePrograms() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('elm_webapp_programs', jsonEncode(_programs));
  }

  Future<void> _loadPrograms() async {
    try {
      List<Map<String, dynamic>> items = [];

      try {
        final sessions = await SupabaseService.getSessions();
        items = sessions.map((s) {
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
        if (!mounted) return;

        if (raw == null || raw.isEmpty) {
          setState(() {
            _programs = <Map<String, dynamic>>[];
            _loading = false;
          });
          return;
        }

        final decoded = jsonDecode(raw);
        items = decoded is List
            ? decoded.whereType<Map>().map((item) {
                return Map<String, dynamic>.from(item);
              }).toList()
            : <Map<String, dynamic>>[];
      }

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

  Future<void> _notifyForSession(Map<String, dynamic> session) async {
    final title = (session['title'] ?? 'Session').toString();
    final date = (session['date'] ?? '').toString();
    final start = (session['start'] ?? '').toString();
    final room = (session['room'] ?? '').toString();

    final notification = AdminNotification(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      title: 'Session Starting Soon',
      message: '$title is about to start on $date at $start${room.isNotEmpty ? ' in $room' : ''}.',
      type: 'session',
      priority: 'high',
      createdAt: DateTime.now(),
    );

    final existing = await AdminStorage.loadNotifications();
    final updated = <AdminNotification>[notification, ...existing];
    await AdminStorage.saveNotifications(updated);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Notification sent for "$title"')),
      );
    }
  }

  Future<void> _notifyForPresentation(
      Map<String, dynamic> session, Map<String, dynamic> presentation) async {
    final sessionTitle = (session['title'] ?? 'Session').toString();
    final presTitle =
        (presentation['title'] ?? 'Presentation').toString();
    final speaker =
        (presentation['speaker'] ?? presentation['presenter'] ?? '').toString();
    final date = (session['date'] ?? '').toString();
    final start =
        (presentation['start'] ?? session['start'] ?? '').toString();
    final room = (session['room'] ?? '').toString();

    final notification = AdminNotification(
      id: DateTime.now().microsecondsSinceEpoch.toString(),
      title: 'Presentation Starting Soon',
      message: '$presTitle by $speaker is about to start on $date at $start${room.isNotEmpty ? ' in $room' : ''} as part of "$sessionTitle".',
      type: 'conference',
      priority: 'high',
      createdAt: DateTime.now(),
    );

    final existing = await AdminStorage.loadNotifications();
    final updated = <AdminNotification>[notification, ...existing];
    await AdminStorage.saveNotifications(updated);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Notification sent for "$presTitle"')),
      );
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
                                        const SizedBox(width: 8),
                                        IconButton(
                                          icon: Icon(
                                            Icons.notifications_active,
                                            size: 20,
                                            color: widget.themeColor,
                                          ),
                                          tooltip: 'Notify attendees',
                                          onPressed: () =>
                                              _notifyForSession(session),
                                          splashRadius: 20,
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
                                    const SizedBox(height: 12),
                                    DropdownButtonFormField<String>(
value: (session['streamId'] ?? '').toString().isNotEmpty
                                        ? (session['streamId'] ?? '').toString()
                                        : null,
                                      decoration: InputDecoration(
                                        labelText: 'Linked stream',
                                        contentPadding: const EdgeInsets.symmetric(
                                            horizontal: 12, vertical: 8),
                                        border: OutlineInputBorder(
                                          borderRadius:
                                              BorderRadius.circular(12),
                                        ),
                                        isDense: true,
                                      ),
                                      isExpanded: true,
                                      items: [
                                        const DropdownMenuItem<String>(
                                          value: null,
                                          child: Text('None'),
                                        ),
                                        ..._streams.map((s) =>
                                            DropdownMenuItem<String>(
                                              value: s.id,
                                              child: Text(s.name),
                                            )),
                                      ],
                                      onChanged: (value) {
                                        setState(() {
                                          session['streamId'] = value;
                                        });
                                        _savePrograms();
                                      },
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
                                                Row(
                                                  children: [
                                                    Expanded(
                                                      child: Text(
                                                        (conference['title'] ??
                                                                'Presentation')
                                                            .toString(),
                                                        style: const TextStyle(
                                                          fontWeight:
                                                              FontWeight.bold,
                                                        ),
                                                      ),
                                                    ),
                                                    IconButton(
                                                      icon: Icon(
                                                        Icons
                                                            .notifications_active,
                                                        size: 18,
                                                        color:
                                                            widget.themeColor,
                                                      ),
                                                      tooltip:
                                                          'Notify attendees',
                                                      onPressed: () =>
                                                          _notifyForPresentation(
                                                              session,
                                                              conference),
                                                      splashRadius: 18,
                                                      constraints:
                                                          const BoxConstraints(
                                                        minWidth: 32,
                                                        minHeight: 32,
                                                      ),
                                                      padding:
                                                          EdgeInsets.zero,
                                                    ),
                                                  ],
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
