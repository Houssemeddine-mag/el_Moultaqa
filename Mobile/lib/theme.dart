import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get theme => ThemeData(
        primaryColor: const Color(0xFF0D7E52),
        colorScheme: ColorScheme.fromSwatch().copyWith(
          secondary: const Color(0xFF1FB69A),
          primary: const Color(0xFF0D7E52),
        ),
        fontFamily: 'Roboto',
        scaffoldBackgroundColor: const Color(0xFFEEFCF4),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF0D7E52),
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          labelStyle: const TextStyle(color: Color(0xFF0D7E52)),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0D7E52),
          iconTheme: IconThemeData(color: Color(0xFF0D7E52)),
          elevation: 0,
          titleTextStyle: TextStyle(
            color: Color(0xFF0D7E52),
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        bottomNavigationBarTheme: const BottomNavigationBarThemeData(
          backgroundColor: Colors.white,
          selectedItemColor: Color(0xFF0D7E52),
          unselectedItemColor: Colors.grey,
          showSelectedLabels: true,
          showUnselectedLabels: true,
        ),
      );
}
