class MobileConfig {
  static const String appName = 'ElMoultaqa Mobile';
  static const String themeColor = '0xFF614F96';
  static const String heroTitle = 'ElMoultaqa Conference';
  static const String heroSubtitle =
      'A premium hybrid conference experience for every event organizer and attendee.';
  static const String conferenceDates = '12-14 December 2026';
  static const String location = 'Algiers · Hybrid';
  static const String liveStreamUrl = 'https://example.com/live/stream.m3u8';
  static const int participants = 1200;
  static const String authWelcome = 'Welcome back to ElMoultaqa';
  static const String authRegister =
      'Create an account to manage your conference journey.';

  static const List<Map<String, String>> upcomingSessions = [
    {'time': '09:00', 'title': 'Opening Ceremony', 'speaker': 'Amina Rahal'},
    {
      'time': '10:30',
      'title': 'Keynote: Tomorrow’s Events',
      'speaker': 'Samir Belkacem',
    },
    {'time': '13:00', 'title': 'Networking Roundtable', 'speaker': 'Amel Kadi'},
  ];

  static const List<Map<String, String>> notifications = [
    {
      'title': 'Welcome to ElMoultaqa',
      'message': 'Check the new agenda and get ready for the opening session.',
      'time': 'Just now',
    },
    {
      'title': 'Keynote Updated',
      'message': 'Keynote start time changed to 10:45 in the Main Hall.',
      'time': '15m ago',
    },
    {
      'title': 'Networking Session',
      'message': 'Join the networking roundtable at 13:00 after the keynote.',
      'time': '1h ago',
    },
  ];

  static const List<Map<String, dynamic>> scheduleDays = [
    {
      'date': '2026-12-12',
      'label': 'Day 1',
      'sessions': [
        {
          'date': '2026-12-12',
          'time': '09:00',
          'title': 'Opening Ceremony',
          'speaker': 'Amina Rahal',
          'room': 'Main Hall',
        },
        {
          'date': '2026-12-12',
          'time': '10:30',
          'title': 'Designing Hybrid Events',
          'speaker': 'Noureddine Fares',
          'room': 'Studio A',
        },
        {
          'date': '2026-12-12',
          'time': '12:00',
          'title': 'Sponsor Spotlight',
          'speaker': 'Leila Mansouri',
          'room': 'Studio B',
        },
      ],
    },
    {
      'date': '2026-12-13',
      'label': 'Day 2',
      'sessions': [
        {
          'date': '2026-12-13',
          'time': '09:30',
          'title': 'Future of Conference Tech',
          'speaker': 'Omar Tarek',
          'room': 'Main Hall',
        },
        {
          'date': '2026-12-13',
          'time': '11:00',
          'title': 'Breakout: Audience Engagement',
          'speaker': 'Yasmine Bensalem',
          'room': 'Studio A',
        },
        {
          'date': '2026-12-13',
          'time': '14:00',
          'title': 'Panel: Event Growth Strategies',
          'speaker': 'Sofiane Gharbi',
          'room': 'Studio B',
        },
      ],
    },
    {
      'date': '2026-12-14',
      'label': 'Day 3',
      'sessions': [
        {
          'date': '2026-12-14',
          'time': '10:00',
          'title': 'Keynote: Scaling for Impact',
          'speaker': 'Nadia Amrani',
          'room': 'Main Hall',
        },
        {
          'date': '2026-12-14',
          'time': '11:30',
          'title': 'Product Demos',
          'speaker': 'Faouzi Kacem',
          'room': 'Studio A',
        },
        {
          'date': '2026-12-14',
          'time': '16:00',
          'title': 'Closing Conversation',
          'speaker': 'Meriem Ziane',
          'room': 'Main Hall',
        },
      ],
    },
  ];
}
