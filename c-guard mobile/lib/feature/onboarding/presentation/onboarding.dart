import 'package:c_guard/app/router/route_constants.dart';
import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/onboarding/widgets/onboard_page.dart';
import 'package:c_guard/providers/onboarding_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

class OnboardingScreen extends StatefulWidget {
  const new({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorManager.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Align(
                alignment: AlignmentGeometry.centerEnd,
                child: TextButton(
                  onPressed: () => context.read<OnboardingProvider>().onPageChanged(2),
                  child: Text(
                    "Skip",
                    style: TextStyle(
                      color: ColorManager.white.withValues(alpha: .7),
                      fontWeight: FontWeight.normal,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: ColorManager.white.withValues(alpha: 0.05),
                ),
                padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  spacing: 5,
                  children: [
                    SvgPicture.asset(context.read<OnboardingProvider>().currentOnboardData.miniIcon),
                    Text(
                      "0${context.watch<OnboardingProvider>().currentOnboardPage + 1}/0${context.watch<OnboardingProvider>().length}",
                      style: TextStyle(
                        letterSpacing: 4,
                        fontWeight: FontWeight.w600,
                        color: ColorManager.white,
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 30),
              Consumer<OnboardingProvider>(
                builder: (context, state, _) {
                  return Expanded(
                    child: PageView.builder(
                      allowImplicitScrolling: true,
                      controller: state.pageController,
                      itemCount: state.length,
                      onPageChanged: state.onPageChanged,
                      itemBuilder: ((context, index) => OnboardPage(
                        onboardingDataObj: state.currentOnboardData,
                      )),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              spacing: 8,
              children: List.generate(
                3,
                (i) => Container(
                  width:
                      context.watch<OnboardingProvider>().currentOnboardPage ==
                          i
                      ? 24
                      : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color:
                        context
                                .watch<OnboardingProvider>()
                                .currentOnboardPage ==
                            i
                        ? ColorManager.white
                        : ColorManager.white.withValues(alpha: .2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
            MaterialButton(
              onPressed: context.watch<OnboardingProvider>().currentOnboardPage ==
                            context.watch<OnboardingProvider>().length - 1
                        ? () {
                          context.pushNamed(RouteConstants.auth);
                        } : () {
                          context.read<OnboardingProvider>().nextPage();
                        },
              height: 43,
              padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              shape: OutlineInputBorder(
                borderSide: BorderSide.none,
                borderRadius: BorderRadius.circular(20),
              ),
              color: ColorManager.blue,
              child: Row(
                spacing: 12,
                children: [
                  Text(
                    context.watch<OnboardingProvider>().currentOnboardPage ==
                            context.watch<OnboardingProvider>().length - 1
                        ? "Get Started"
                        : "Next",
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 18,
                      color: ColorManager.white,
                    ),
                  ),
                  Icon(
                    Icons.arrow_forward,
                    color: ColorManager.white,
                    weight: 40,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
