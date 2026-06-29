import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import 'models.dart';

class AdminStorage {
  static const String _notificationsKey = 'elm_admin_notifications';
  static const String _webNotificationsKey = 'elm_webapp_notifications';
  static const String _questionsKey = 'elm_stream_questions';
  static const String _streamsKey = 'elm_admin_streams';

  static Future<List<AdminNotification>> loadNotifications() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_notificationsKey);
    if (raw == null || raw.isEmpty) return <AdminNotification>[];

    final decoded = jsonDecode(raw);
    if (decoded is! List) return <AdminNotification>[];

    return decoded
        .whereType<Map>()
        .map((map) => AdminNotification.fromMap(Map<String, dynamic>.from(map)))
        .toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
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
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_questionsKey);
    if (raw == null || raw.isEmpty) return <StreamQuestion>[];

    final decoded = jsonDecode(raw);
    if (decoded is! List) return <StreamQuestion>[];

    return decoded
        .whereType<Map>()
        .map((map) => StreamQuestion.fromMap(Map<String, dynamic>.from(map)))
        .toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  static Future<void> saveQuestions(List<StreamQuestion> questions) async {
    final prefs = await SharedPreferences.getInstance();
    final encoded = jsonEncode(
      questions.map((question) => question.toMap()).toList(),
    );
    await prefs.setString(_questionsKey, encoded);
  }

  static Future<List<LiveStream>> loadStreams() async {
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
}
