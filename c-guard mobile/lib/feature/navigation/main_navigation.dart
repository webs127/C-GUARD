import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_background.dart';
import 'package:c_guard/providers/main_navigation_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MainNavigationScreen extends StatefulWidget {
  const new({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  @override
  Widget build(BuildContext context)  {
    return Consumer<MainNavigationProvider>(
      builder: (context, state, _) {
        return CustomBackGround(
          body: state.view,
          bottomNavigationBar: BottomNavigationBar(
            onTap: state.onViewChanged,
            currentIndex: state.currentView,
            type: BottomNavigationBarType.fixed,
            backgroundColor: ColorManager.white,
            selectedItemColor: ColorManager.blue,
            unselectedItemColor: ColorManager.grey,
            items: [
              BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
              BottomNavigationBarItem(
                icon: Icon(Icons.map_outlined),
                label: "Journey",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.history_outlined),
                label: "History",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_outline),
                label: "Profile",
              ),
            ],
          ),
        );
      }
    );
  }
}
