import 'package:flutter/material.dart';

import '../mobile_config.dart';
import 'admin_dashboard_page.dart';

void main() {
  runApp(const ElMoultaqaAdminNotifApp());
}

class ElMoultaqaAdminNotifApp extends StatelessWidget {
  const ElMoultaqaAdminNotifApp({super.key});

  Color _parseColor(String? rawColor) {
    final raw = rawColor ?? '0xFF0D7E52';
    final hex = raw.startsWith('#')
        ? '0xff${raw.substring(1)}'
        : raw.startsWith('0x')
            ? raw
            : '0xff$raw';
    return Color(int.parse(hex));
  }

  @override
  Widget build(BuildContext context) {
    final themeColor = _parseColor(MobileConfig.themeColor);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: '${MobileConfig.appName} Admin',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: themeColor),
        useMaterial3: true,
      ),
      home: AdminDashboardPage(themeColor: themeColor),
    );
  }
}
