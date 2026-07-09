class MobileConfig {
  static String appName = 'ElMoultaqa';
  static String themeColor = '0xFF0D7E52';
  static String orgSlug = '';
  static String logoUrl = '';

  static String heroTitle = 'Conference';
  static String heroSubtitle =
      'A premium conference experience for every attendee.';
  static String conferenceDates = '';
  static String location = '';
  static String conferenceDescription = '';
  static String liveStreamUrl = '';
  static int participants = 0;

  static String authWelcome = 'Welcome back';
  static String authRegister = 'Create an account';

  static List<Map<String, String>> upcomingSessions = [];
  static List<Map<String, String>> notifications = [];
  static List<Map<String, dynamic>> scheduleDays = [];

  static void loadFromService(Map<String, dynamic>? orgDetails, Map<String, dynamic>? config) {
    if (orgDetails != null) {
      final rawName = orgDetails['name'] as String?;
      if (rawName != null && rawName.isNotEmpty) appName = rawName;
      final rawSlug = orgDetails['slug'] as String?;
      if (rawSlug != null && rawSlug.isNotEmpty) orgSlug = rawSlug;
      final rawLogo = orgDetails['logo_url'] as String?;
      if (rawLogo != null && rawLogo.isNotEmpty) logoUrl = rawLogo;
      final rawColor = orgDetails['theme_color'] as String?;
      if (rawColor != null && rawColor.isNotEmpty) {
        themeColor = rawColor.startsWith('#') ? '0xff${rawColor.substring(1)}' : '0xff$rawColor';
      }
    }

    if (config != null) {
      final rawTitle = config['name'] as String?;
      if (rawTitle != null && rawTitle.isNotEmpty) heroTitle = rawTitle;
      final rawDates = config['startDate'] as String?;
      if (rawDates != null && rawDates.isNotEmpty) conferenceDates = rawDates;
      final rawLocation = config['location'] as String?;
      if (rawLocation != null && rawLocation.isNotEmpty) location = rawLocation;
      final rawStream = config['stream_url'] as String?;
      if (rawStream != null && rawStream.isNotEmpty) liveStreamUrl = rawStream;
      final rawTheme = config['themeColor'] as String?;
      if (rawTheme != null && rawTheme.isNotEmpty) {
        themeColor = rawTheme.startsWith('#') ? '0xff${rawTheme.substring(1)}' : '0xff$rawTheme';
      }
    }
  }
}
