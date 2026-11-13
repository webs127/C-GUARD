import 'package:c_guard/app/router/route_constants.dart';
import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/core/managers/image_manager.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const new({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  void start() {
    Future.delayed(Duration(seconds: 3), navigate);
  }

  void navigate() {
    context.pushReplacementNamed(RouteConstants.onboarding);
  }

  @override
  void initState() {
    super.initState();
    start();
  }
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorManager.background,
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(ImageManager.logo),
            Text(
              "C-GUARD",
              style: TextStyle(
                color: ColorManager.white,
                fontWeight: FontWeight.bold,
                fontSize: 32,
                letterSpacing: 4,
              ),
            ),
            SizedBox(height: 15),
            Divider(
              color: ColorManager.white.withValues(alpha: 0.7),
              thickness: .2,
            ),
            SizedBox(height: 10),
            Text(
              "CORPS MEMBER JOURNEY SAFETY & EMERGENCY RESPONSE SYSTEM",
              textAlign: TextAlign.center,
              style: TextStyle(
                color: ColorManager.white.withValues(alpha: 0.5),
                fontWeight: FontWeight.w400,
                fontSize: 16,
                letterSpacing: 2,
              ),
            ),
            SizedBox(height: 30),
            SizedBox(
              width: MediaQuery.of(context).size.width * 0.5,
              child: LinearProgressIndicator(
                color: ColorManager.blue,
                value: .5,
                backgroundColor: ColorManager.background1,
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            SizedBox(height: 15),
            Text(
              "INITIALIZING",
              style: TextStyle(
                color: ColorManager.white.withValues(alpha: 0.5),
                fontWeight: FontWeight.w400,
                fontSize: 16,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(18.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 50,
              child: Divider(
                color: ColorManager.white.withValues(alpha: 0.7),
                thickness: .2,
              ),
            ),
            SizedBox(height: 10),
            Text(
              "\"Every Journey Matters. Every Life Counts.\"",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontStyle: FontStyle.italic,
                color: ColorManager.white.withValues(alpha: 0.5),
                fontWeight: FontWeight.w400,
                fontSize: 16,
              ),
            ),
            SizedBox(height: 20),
            Text(
              "POWERED BY AEGIS",
              textAlign: TextAlign.center,
              style: TextStyle(
                color: ColorManager.white.withValues(alpha: 0.2),
                fontWeight: FontWeight.w400,
                fontSize: 16,
                letterSpacing: 3,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
