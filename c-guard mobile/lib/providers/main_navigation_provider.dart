import 'package:c_guard/feature/navigation/history/presentation/history.dart';
import 'package:c_guard/feature/navigation/home/presentation/home.dart';
import 'package:c_guard/feature/navigation/journey/presentation/journey.dart';
import 'package:c_guard/feature/navigation/profile/presentation/profile.dart';
import 'package:flutter/material.dart';

class MainNavigationProvider with ChangeNotifier {
  final List<Widget> _views = [
    HomeScreen(),
    JourneyScreen(),
    HistoryScreen(),
    ProfileScreen(),
  ];
int currentView = 0;
  Widget get view => _views[currentView];

  void onViewChanged(int index) {
    currentView = index;
    notifyListeners();
  }
}
