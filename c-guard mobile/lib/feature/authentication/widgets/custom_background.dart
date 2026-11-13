import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';

class CustomBackGround extends StatelessWidget {
  final Widget body;
  final Color? color;
  final Color? backgroundColor;
  final BottomNavigationBar? bottomNavigationBar;
  const CustomBackGround({super.key, required this.body, this.color, this.bottomNavigationBar, this.backgroundColor});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor ?? ColorManager.whitebackground,
      body: Stack(
        children: [
          Align(
            alignment: AlignmentGeometry.topRight,
            child: Container(
              width: 200,
              height: 250,
              decoration: BoxDecoration(
                color: color?.withValues(alpha: .05) ?? ColorManager.blue.withValues(alpha: .05),
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(100),
                  bottomLeft: Radius.circular(100),
                ),
              ),
            ),
          ),
          Align(
            alignment: AlignmentGeometry.bottomLeft,
            child: Container(
              width: 200,
              height: 250,
              decoration: BoxDecoration(
                color: color?.withValues(alpha: .05) ?? ColorManager.blue.withValues(alpha: .05),
                borderRadius: BorderRadius.only(
                  topRight: Radius.circular(100),
                  bottomRight: Radius.circular(100),
                ),
              ),
            ),
          ),
          body
        ],
      ),
      bottomNavigationBar: bottomNavigationBar,
    );
  }
}
