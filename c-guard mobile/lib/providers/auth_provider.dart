import 'package:c_guard/feature/authentication/presentation/steps/step1.dart';
import 'package:c_guard/feature/authentication/presentation/steps/step2.dart';
import 'package:c_guard/feature/authentication/presentation/steps/step3.dart';
import 'package:c_guard/feature/authentication/presentation/steps/step4.dart';
import 'package:c_guard/mock/corp_member_mock_service.dart';
import 'package:c_guard/mock/models/corp_member_model.dart';
import 'package:flutter/material.dart';

class AuthProvider with ChangeNotifier {
  bool isLogin = false;
  final TextEditingController email = TextEditingController();
  final TextEditingController password = TextEditingController();
  final TextEditingController phoneNumber = TextEditingController();
  final TextEditingController fullname = TextEditingController();
  final TextEditingController callUpNumber = TextEditingController();
  final TextEditingController assignedState = TextEditingController();
  final TextEditingController orientationCamp = TextEditingController();
  final TextEditingController contactName = TextEditingController();
  final TextEditingController contactPhoneNumber = TextEditingController();
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();
  final CorpMemberMockService _corpMemberMockService = CorpMemberMockService();
  CorpMember? corpMember;
  bool isloading = false;
  bool _corpMembersInitialized = false;

  final List<Widget> _steps = [
    AuthStep1(),
    AuthStep2(),
    AuthStep3(),
    AuthStep4(),
  ];
  int currentStep = 0;

  Widget get step => IndexedStack(index: currentStep, children: _steps);

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

  void onLoginChanged() {
    isLogin = !isLogin;
    notifyListeners();
  }

  Future<void> getCorpMemberData() async {
    isloading = true;
    notifyListeners();
    try {
      if (!_corpMembersInitialized) {
        await _corpMemberMockService.init();
        _corpMembersInitialized = true;
      }
      corpMember = await _corpMemberMockService.findCorpMember(
        callUpNumber: callUpNumber.text,
      );
      if (corpMember == null) {
        assignedState.clear();
        orientationCamp.clear();
      } else {
        setvalues();
      }
    } finally {
      isloading = false;
      notifyListeners();
    }
  }

  void setvalues() {
    final member = corpMember;
    if (member == null) {
      return;
    }
    assignedState.text = member.assignedState;
    orientationCamp.text = member.orientationCamp;
  }

  void validate() {
    if (!formKey.currentState!.validate()) {
    } else {
    }
  }
}
