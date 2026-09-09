import 'package:flutter/material.dart';

class AppTheme {
  /// Builds the app's ThemeData from the org's resolved brand color.
  /// [primary] should already be a fully-parsed, validated Color —
  /// see `theme_utils.dart#parseThemeColor` for how MobileConfig.themeColor
  /// gets turned into one.
  static ThemeData themed(Color primary) {
    final secondary = _deriveSecondary(primary);

    return ThemeData(
      primaryColor: primary,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
      ).copyWith(
        primary: primary,
        secondary: secondary,
      ),
      fontFamily: 'Roboto',
      scaffoldBackgroundColor: _tintedBackground(primary),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        labelStyle: TextStyle(color: primary),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: primary, width: 2),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: primary,
        iconTheme: IconThemeData(color: primary),
        elevation: 0,
        titleTextStyle: TextStyle(
          color: primary,
          fontWeight: FontWeight.bold,
          fontSize: 20,
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: primary,
        unselectedItemColor: Colors.grey,
        showSelectedLabels: true,
        showUnselectedLabels: true,
      ),
    );
  }

  /// Fallback theme for the brief window before org config has loaded
  /// (e.g. first frame of main.dart, before MobileConfig.loadFromService runs).
  static ThemeData get fallback => themed(const Color(0xFF0D7E52));

  static Color _tintedBackground(Color primary) {
    // Very light tint of the brand color, matching the previous
    // 0xFFEEFCF4-style background but derived per-org instead of hardcoded.
    return Color.alphaBlend(primary.withValues(alpha: 0.06), Colors.white);
  }

  static Color _deriveSecondary(Color primary) {
    final hsl = HSLColor.fromColor(primary);
    return hsl.withHue((hsl.hue + 20) % 360).withLightness(
      (hsl.lightness + 0.1).clamp(0.0, 1.0),
    ).toColor();
  }
}