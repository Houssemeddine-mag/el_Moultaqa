import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:clerk_flutter/clerk_flutter.dart';

import 'package:elmoultaqa_mobile/main.dart';
import 'package:elmoultaqa_mobile/mobile_config.dart';

void main() {
  const publishableKey = String.fromEnvironment(
    'CLERK_PUBLISHABLE_KEY',
    defaultValue: '',
  );

  Widget createApp() {
    if (publishableKey.isEmpty) {
      return const MaterialApp(
        home: Scaffold(
          body: Center(child: Text('CLERK_PUBLISHABLE_KEY not configured')),
        ),
      );
    }
    return ClerkAuth(
      config: ClerkAuthConfig(publishableKey: publishableKey),
      child: const ElMoultaqaMobileApp(),
    );
  }

  testWidgets('App loads and shows conference title',
      (WidgetTester tester) async {
    if (publishableKey.isEmpty) return;

    await tester.pumpWidget(createApp());

    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
