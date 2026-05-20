// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:elmoultaqa_mobile/main.dart';
import 'package:elmoultaqa_mobile/mobile_config.dart';

void main() {
  testWidgets('App loads and shows conference title',
      (WidgetTester tester) async {
    await tester.pumpWidget(const ElMoultaqaMobileApp());
    await tester.pumpAndSettle();

    expect(find.text(MobileConfig.appName), findsOneWidget);
    expect(find.text('LIVE'), findsWidgets);
  });
}
