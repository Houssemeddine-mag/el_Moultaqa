import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../mobile_config.dart';

class SupabaseService {
  static SupabaseClient? _client;
  static const _storage = FlutterSecureStorage();

  static Future<String?> _read(String key) async {
    return await _storage.read(key: key);
  }

  static Future<void> _write(String key, String value) async {
    await _storage.write(key: key, value: value);
  }
  static String? schemaName;
  static String? orgSlug;
  static Map<String, dynamic>? orgDetails;
  static String? currentUserEmail;

  // Callback to fetch Clerk JWT. Will be set in the UI layer (main.dart or auth_page.dart).
  static Future<String?> Function()? tokenProvider;

  static SupabaseClient get client {
    if (_client == null) {
      throw Exception("SupabaseService is not initialized. Call initialize() first.");
    }
    return _client!;
  }

  static String _envValue(String key) {
    try {
      return dotenv.maybeGet(key) ?? '';
    } catch (_) {
      return '';
    }
  }

  static Future<void> initialize() async {
    // 1. Load dotenv if available
    try {
      await dotenv.load(fileName: ".env");
    } catch (_) {}

    final url = _envValue("SUPABASE_URL");
    final anonKey = _envValue("SUPABASE_ANON_KEY");

    if (url.isEmpty || anonKey.isEmpty) {
      throw Exception(
        'SUPABASE_URL and SUPABASE_ANON_KEY are not configured. '
        'This APK was built without a .env file.',
      );
    }

    // 2. Initialize SupabaseClient with a dynamic accessToken callback
    _client = SupabaseClient(
      url,
      anonKey,
      accessToken: () async {
        if (tokenProvider != null) {
          return await tokenProvider!();
        }
        return null;
      },
    );

    // 3. Try to load cached schemaName
    schemaName = await _read("elm_schema_name");
  }

  // Resolves the org slug dynamically
  static Future<void> resolveOrg([String? slug]) async {
    final cached = await _read("elm_org_slug");
    final envSlug = _envValue("ORG_SLUG");
    slug = (slug != null && slug.isNotEmpty)
        ? slug
        : ((cached != null && cached.isNotEmpty)
            ? cached
            : (envSlug.isNotEmpty ? envSlug : MobileConfig.orgSlug));
    if (slug.isEmpty) {
      throw Exception("orgSlug is not configured");
    }

    orgSlug = slug;
    final data = await client.rpc("resolve_org_slug", params: {"p_slug": slug});
    if (data == null) {
      throw Exception("Failed to resolve organization slug: $slug");
    }

    if (data is List && data.isEmpty) {
      throw Exception("No organization found for slug: $slug");
    }

    final Map<String, dynamic> org = data is List
        ? Map<String, dynamic>.from((data).first)
        : Map<String, dynamic>.from(data);

    schemaName = org["schema_name"]?.toString();
    orgDetails = org;
    if (schemaName != null) {
      await _write("elm_schema_name", schemaName!);
    }
    await _write("elm_org_slug", slug);
  }

  // Dynamic helper to execute org_query RPC
  static Future<List<Map<String, dynamic>>> queryOrgTable(
    String tableName, {
    Map<String, dynamic> filters = const {},
    int limit = 100,
    int offset = 0,
    String orderBy = "created_at",
    String orderDir = "DESC",
  }) async {
    if (schemaName == null) {
      await resolveOrg();
    }
    
    final List<dynamic> response = await client.rpc("org_query", params: {
      "p_schema_name": schemaName,
      "p_table_name": tableName,
      "p_filters": filters,
      "p_limit": limit,
      "p_offset": offset,
      "p_order_by": orderBy,
      "p_order_dir": orderDir,
    }).timeout(const Duration(seconds: 10));

    return response.map((item) => Map<String, dynamic>.from(item)).toList();
  }

  // Dynamic helper to execute org_insert RPC
  static Future<Map<String, dynamic>> insertOrgTable(
    String tableName,
    Map<String, dynamic> data,
  ) async {
    if (schemaName == null) {
      await resolveOrg();
    }

    final response = await client.rpc("org_insert", params: {
      "p_schema_name": schemaName,
      "p_table_name": tableName,
      "p_data": data,
    }).timeout(const Duration(seconds: 10));

    return Map<String, dynamic>.from(response);
  }

  // Dynamic helper to execute org_update RPC
  static Future<Map<String, dynamic>> updateOrgTable(
    String tableName,
    String id,
    Map<String, dynamic> data,
  ) async {
    if (schemaName == null) {
      await resolveOrg();
    }

    final response = await client.rpc("org_update", params: {
      "p_schema_name": schemaName,
      "p_table_name": tableName,
      "p_id": id,
      "p_data": data,
    }).timeout(const Duration(seconds: 10));

    return Map<String, dynamic>.from(response);
  }

  // Dynamic helper to execute org_delete RPC
  static Future<void> deleteOrgTable(String tableName, String id) async {
    if (schemaName == null) {
      await resolveOrg();
    }

    await client.rpc("org_delete", params: {
      "p_schema_name": schemaName,
      "p_table_name": tableName,
      "p_id": id,
    }).timeout(const Duration(seconds: 10));
  }

  // Allow setting org slug from resolve flow
  static Future<void> setOrgSlug(String slug) async {
    orgSlug = slug;
    await _write("elm_org_slug", slug);
  }

  // Fetch org details directly
  static Future<Map<String, dynamic>?> fetchOrgDetails(String slug) async {
    try {
      final data = await client.rpc("resolve_org_slug", params: {"p_slug": slug});
      if (data == null) return null;
      if (data is List && data.isEmpty) return null;
      final org = data is List
          ? Map<String, dynamic>.from((data).first)
          : Map<String, dynamic>.from(data);
      return org;
    } catch (_) {
      return null;
    }
  }

  // ── Streams API ───────────────────────────────────────────────────

  static Future<List<Map<String, dynamic>>> getStreams() async {
    final events = await queryOrgTable("events", limit: 1);
    if (events.isEmpty) return [];
    final settings = events.first["settings"] as Map<String, dynamic>?;
    final streams = settings?["streams"] as List<dynamic>?;
    if (streams == null) return [];
    return streams.map((s) => Map<String, dynamic>.from(s)).toList();
  }

  // ── Attendee data APIs ────────────────────────────────────────────
  
  static Future<Map<String, dynamic>?> getConferenceConfig() async {
    final events = await queryOrgTable("events", limit: 1);
    if (events.isEmpty) return null;
    final ev = events.first;
    return {
      "name": ev["title"],
      "shortName": ev["short_name"],
      "themeColor": ev["settings"]?["themeColor"] ?? "#0d7e52",
      "logo": ev["cover_image_url"] ?? ev["settings"]?["logo_url"] ?? "",
      "startDate": ev["start_date"],
      "endDate": ev["end_date"],
      "sponsors": ev["settings"]?["sponsors"] ?? [],
      "collaborators": ev["settings"]?["collaborators"] ?? [],
      "attendees": ev["settings"]?["attendees"] ?? [],
      "stream_url": ev["settings"]?["stream_url"] ?? ev["stream_url"] ?? "",
      "location": ev["settings"]?["location"] ?? "",
      "description": ev["settings"]?["description"] ?? "",
      "website": ev["website"] ??
          ev["settings"]?["website"] ??
          ev["settings"]?["conferenceWebsite"] ??
          ev["settings"]?["web_url"] ??
          "",
      "settings": ev["settings"] ?? {},
    };
  }

  static Future<List<Map<String, dynamic>>> getSessions() async {
    return await queryOrgTable("sessions", orderBy: "start_time", orderDir: "ASC");
  }

  static Future<List<Map<String, dynamic>>> getSpeakers() async {
    return await queryOrgTable("speakers", orderBy: "full_name", orderDir: "ASC");
  }

  static Future<Map<String, dynamic>?> getMyProfile([String? email]) async {
    if (email == null || email.isEmpty) {
      return null;
    }

    final users = await queryOrgTable("users", filters: {"email": email}, limit: 1);
    if (users.isEmpty) return null;
    return users.first;
  }

  static Future<Map<String, dynamic>> updateMyProfile(String id, Map<String, dynamic> data) async {
    return await updateOrgTable("users", id, data);
  }

  static Future<List<Map<String, dynamic>>> getNotifications() async {
    return await queryOrgTable("notifications", orderBy: "created_at", orderDir: "DESC");
  }

  static Future<List<Map<String, dynamic>>> getQuestions() async {
    return await queryOrgTable("questions", orderBy: "created_at", orderDir: "DESC");
  }

  static Future<void> submitQuestion(Map<String, dynamic> data) async {
    await insertOrgTable("questions", data);
  }

  // ── Feedback API ──────────────────────────────────────────────────

  static Future<void> submitFeedback(Map<String, dynamic> data) async {
    await insertOrgTable("feedback", data);
  }

  // ── Admin data APIs ───────────────────────────────────────────────

  static Future<List<Map<String, dynamic>>> getAllUsers() async {
    return await queryOrgTable("users", orderBy: "full_name", orderDir: "ASC");
  }

  static Future<List<Map<String, dynamic>>> getAllQuestions() async {
    return await queryOrgTable("questions", orderBy: "created_at", orderDir: "DESC");
  }

  static Future<void> sendNotification(String title, String content) async {
    await insertOrgTable("notifications", {
      "title": title,
      "content": content,
    });
  }

  static Future<void> answerQuestion(String questionId, String answer) async {
    await updateOrgTable("questions", questionId, {
      "answer": answer,
    });
  }

  static Future<void> deleteNotification(String id) async {
    await deleteOrgTable("notifications", id);
  }
}
