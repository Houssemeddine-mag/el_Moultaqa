class MobileConfig {
  // Template Configuration - Customize these values in admin panel
  static const String appName = 'ElMoultaqa';
  static const String themeColor = '0xFF0D7E52';

  // Conference details - will be populated from admin settings
  static const String heroTitle = 'Conference';
  static const String heroSubtitle =
      'A premium conference experience for every attendee.';
  static const String conferenceDates = 'December 12-14, 2026';
  static const String location = 'Algiers · Hybrid';
  static const String conferenceDescription =
      'ElMoultaqa brings together attendees, speakers, and organizers in one polished conference experience.';
  static const String liveStreamUrl = '';
  static const int participants = 0;

  // Authentication text - customizable for any conference
  static const String authWelcome = 'Welcome back';
  static const String authRegister = 'Create an account';

  // Data will be populated from API/localStorage
  static const List<Map<String, String>> upcomingSessions = [];
  static const List<Map<String, String>> notifications = [];
  static const List<Map<String, dynamic>> scheduleDays = [];
}
