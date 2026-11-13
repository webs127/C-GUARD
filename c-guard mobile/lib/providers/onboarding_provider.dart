import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/core/managers/image_manager.dart';
import 'package:flutter/material.dart';

class OnboardingProvider with ChangeNotifier {
  int currentOnboardPage = 0;
  final PageController pageController = PageController();
  final List<OnboardingDataObj> _onboardingContents = [
    OnboardingDataObj(
      onboardImage: ImageManager.onboarding1,
      label: "Your Journey, Monitored",
      labelIcon: ImageManager.location,
      miniIcon: ImageManager.shield,
      content: "C-GUARD tracks your tripto your assigned NYSC orientation camp. Authorized NYSC personnel monitor your journey in real time to ensure you arrive safely.",
      perks: [
        "Real-time location tracking",
        "Monitored by NYSC personnel",
        "Private and secure by design",
      ],
    ),
    OnboardingDataObj(
      onboardImage: ImageManager.onboarding2,
      label: "Stay Connected",
      labelIcon: ImageManager.location,
      miniIcon: ImageManager.hotspot,
      content: "C-GUARD periodically shares your GPS location and journey status updates with the NYSC monitoring team, even under intermittent connectivity.",
      perks: [
        "Automatic location updates",
        "Works with low connectivity",
        "Journey status notifications",
      ],
    ),
    OnboardingDataObj(
      onboardImage: ImageManager.onboarding3,
      label: "Help When It Matters",
      labelIcon: ImageManager.location,
      miniIcon: ImageManager.light,
      content: "If you encounter an emergency, activate the SOS button to immediately alert NYSC monitoring personnel and your emergency contacts with your last known location.",
      perks: [
        "One-tap SOS emergency alert",
        "Notifies emergency contacts",
        "Shares your last known location",
      ],
    ),
  ];

  final List<Color> _colors = [
    ColorManager.blue,
    ColorManager.green,
    ColorManager.red,
  ];

  Color get color => _colors[currentOnboardPage];
  OnboardingDataObj get currentOnboardData =>
      _onboardingContents[currentOnboardPage];

  int get length => _onboardingContents.length;

  void onPageChanged(int value) {
    currentOnboardPage = value;
    notifyListeners();
  }

  void nextPage() {
    pageController.nextPage(
      duration: Durations.extralong1,
      curve: Curves.easeIn,
    );
  }

  void previousPage() {
    pageController.previousPage(
      duration: Durations.extralong4,
      curve: Curves.bounceInOut,
    );
  }
}

class OnboardingDataObj {
  final String onboardImage;
  final String label;
  final String labelIcon;
  final String miniIcon;
  final String content;
  final List<String> perks;

  new({
    required this.onboardImage,
    required this.label,
    required this.labelIcon,
    required this.miniIcon,
    required this.content,
    required this.perks,
  });
}
