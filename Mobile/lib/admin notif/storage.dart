import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../services/supabase_service.dart';
import 'models.dart';

class AdminStorage {
  static const String _notificationsKey = 'elm_admin_notifications';
  static const String _webNotificationsKey = 'elm_webapp_notifications';
  static const String _questionsKey = 'elm_stream_questions';
  static const String _streamsKey = 'elm_admin_streams';
  static const String _readNotificationIdsKey = 'elm_read_notification_ids';

  static Future<List<AdminNotification>> loadNotifications() async {
    try {
      final data = await SupabaseService.getNotifications();
      return data.map((n) {
        return AdminNotification(
          id: (n['id'] ?? '').toString(),
          title: (n['title'] ?? '').toString(),
          message: (n['message'] ?? n['content'] ?? '').toString(),
          type: (n['type'] ?? 'info').toString(),
          priority: (n['priority'] ?? 'normal').toString(),
          createdAt: DateTime.tryParse(n['created_at']?.toString() ?? '') ??
              DateTime.now(),
        );
      }).toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    } catch (_) {
      // Fallback to local storage
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_notificationsKey);
      if (raw == null || raw.isEmpty) return <AdminNotification>[];

      final decoded = jsonDecode(raw);
      if (decoded is! List) return <AdminNotification>[];

      return decoded
          .whereType<Map>()
          .map((map) =>
              AdminNotification.fromMap(Map<String, dynamic>.from(map)))
          .toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    }
  }

  static Future<void> saveNotifications(
      List<AdminNotification> notifications) async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(
      notifications.map((notification) => notification.toMap()).toList(),
    );
    await prefs.setString(_notificationsKey, encoded);
    // Mirror to webapp key when running on web with shared origin.
    await prefs.setString(_webNotificationsKey, encoded);
  }

  static Future<List<StreamQuestion>> loadQuestions() async {
    try {
      final data = await SupabaseService.getQuestions();
      return data.map((q) {
        return StreamQuestion(
          id: (q['id'] ?? '').toString(),
          author: (q['author_name'] ?? 'Anonymous').toString(),
          message: (q['message'] ?? '').toString(),
          createdAt:
              DateTime.tryParse(q['created_at']?.toString() ?? '') ??
                  DateTime.now(),
          isAnswered: q['is_answered'] == true,
          answer: q['answer']?.toString(),
          streamId: q['stream_id']?.toString(),
          sessionTitle: q['session_title']?.toString(),
          presentationTitle: q['presentation_title']?.toString(),
        );
      }).toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    } catch (_) {
      // Fallback to local storage
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_questionsKey);
      if (raw == null || raw.isEmpty) return <StreamQuestion>[];

      final decoded = jsonDecode(raw);
      if (decoded is! List) return <StreamQuestion>[];

      return decoded
          .whereType<Map>()
          .map((map) =>
              StreamQuestion.fromMap(Map<String, dynamic>.from(map)))
          .toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    }
  }

  static Future<void> saveQuestions(List<StreamQuestion> questions) async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(
      questions.map((question) => question.toMap()).toList(),
    );
    await prefs.setString(_questionsKey, encoded);
  }

  static Future<List<LiveStream>> loadStreams() async {
    try {
      final data = await SupabaseService.getStreams();
      return data.map((s) {
        return LiveStream(
          id: (s['id'] ?? '').toString(),
          name: (s['name'] ?? '').toString(),
          url: (s['url'] ?? '').toString(),
          createdAt:
              DateTime.tryParse(s['createdAt']?.toString() ?? '') ??
                  DateTime.now(),
        );
      }).toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    } catch (_) {
      // Fallback to local storage
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_streamsKey);
      if (raw == null || raw.isEmpty) return <LiveStream>[];

      final decoded = jsonDecode(raw);
      if (decoded is! List) return <LiveStream>[];

      return decoded
          .whereType<Map>()
          .map((map) => LiveStream.fromMap(Map<String, dynamic>.from(map)))
          .toList()
        ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    }
  }

  static Future<void> saveStreams(List<LiveStream> streams) async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(
      streams.map((stream) => stream.toMap()).toList(),
    );
    await prefs.setString(_streamsKey, encoded);
  }

  static Future<void> addStream(LiveStream stream) async {
    final streams = await loadStreams();
    streams.insert(0, stream);
    await saveStreams(streams);
  }

  static Future<void> removeStream(String id) async {
    final streams = await loadStreams();
    streams.removeWhere((s) => s.id == id);
    await saveStreams(streams);
  }

  static Future<Set<String>> _loadReadNotificationIds() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_readNotificationIdsKey);
    if (raw == null || raw.isEmpty) return <String>{};
    final decoded = jsonDecode(raw);
    if (decoded is! List) return <String>{};
    return decoded.map((e) => e.toString()).toSet();
  }

  static Future<void> markNotificationsRead(List<String> ids) async {
    final prefs = await SharedPreferences.getInstance();
    final readIds = await _loadReadNotificationIds();
    readIds.addAll(ids);
    await prefs.setString(_readNotificationIdsKey, jsonEncode(readIds.toList()));
  }

  static Future<int> getUnreadNotificationCount() async {
    final notifications = await loadNotifications();
    final readIds = await _loadReadNotificationIds();
    return notifications.where((n) => !readIds.contains(n.id)).length;
  }
}
