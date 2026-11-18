import 'package:c_guard/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

void main() {
  testWidgets('call-up lookup runs outside field validation', (tester) async {
    final authProvider = AuthProvider()..currentStep = 2;

    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: authProvider,
        child: MaterialApp(
          home: Scaffold(
            body: Form(key: authProvider.formKey, child: authProvider.step),
          ),
        ),
      ),
    );

    await tester.enterText(
      find.byType(TextFormField).first,
      'NYSC/FUM/2026/10001',
    );

    expect(tester.takeException(), isNull);
    expect(authProvider.isloading, isTrue);

    await tester.pump(const Duration(seconds: 4));
    await tester.pump();

    expect(authProvider.assignedState.text, 'Abuja');
    expect(
      authProvider.orientationCamp.text,
      'NYSC Permanent Orientation Camp, Kubwa, Abuja',
    );
    expect(authProvider.isloading, isFalse);
  });

  testWidgets('validates fields from every authentication step', (
    tester,
  ) async {
    final authProvider = AuthProvider()..currentStep = 3;

    await tester.pumpWidget(
      ChangeNotifierProvider.value(
        value: authProvider,
        child: MaterialApp(
          home: Consumer<AuthProvider>(
            builder: (context, state, _) => Scaffold(
              body: SingleChildScrollView(
                child: Form(key: state.formKey, child: state.step),
              ),
            ),
          ),
        ),
      ),
    );

    authProvider.validate();
    await tester.pump();

    expect(find.text('Required', skipOffstage: false), findsNWidgets(9));
  });
}
