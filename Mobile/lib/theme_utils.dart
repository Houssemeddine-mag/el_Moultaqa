import 'package:flutter/material.dart';

Color parseThemeColor([String? rawColor]) {
  final raw = (rawColor ?? '0xFF0D7E52').isEmpty ? '0xFF0D7E52' : rawColor!;
  String hex;
  if (raw.startsWith('#')) {
    hex = '0xff${raw.substring(1)}';
  } else if (raw.startsWith('0x')) {
    hex = raw;
  } else {
    hex = '0xff$raw';
  }
  try {
    return Color(int.parse(hex));
  } catch (_) {
    return const Color(0xFF0D7E52);
  }
}

/// Lightens a color for use as a gradient's second stop, preserving hue
/// so every org's gradient stays visually coherent with their brand color.
Color lightenColor(Color color, [double amount = 0.18]) {
  final hsl = HSLColor.fromColor(color);
  final lightness = (hsl.lightness + amount).clamp(0.0, 1.0);
  return hsl.withLightness(lightness).toColor();
}
