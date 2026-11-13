import 'package:c_guard/feature/authentication/presentation/steps/step1.dart';
import 'package:c_guard/feature/authentication/presentation/steps/step2.dart';
import 'package:c_guard/feature/authentication/presentation/steps/step3.dart';
import 'package:c_guard/feature/authentication/presentation/steps/step4.dart';
import 'package:flutter/material.dart';

class AuthProvider with ChangeNotifier {
  final List<Widget> _steps = [
    AuthStep1(),
    AuthStep2(),
    AuthStep3(),
    AuthStep4(),
  ];
  int currentStep = 0;

  Widget get step => _steps[currentStep];

  int get length => _steps.length;

  void nextStep() {
    if (currentStep < _steps.length - 1) {
      currentStep++;
    }
    notifyListeners();
  }

  void previousStep() {
    if (currentStep <= 0) {
      currentStep = 0;
    }
    currentStep--;
    notifyListeners();
  }
}
