import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/core/managers/image_manager.dart';
import 'package:c_guard/feature/onboarding/widgets/onboarding_perk.dart';
import 'package:c_guard/providers/onboarding_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';

class OnboardPage extends StatelessWidget {
  final OnboardingDataObj onboardingDataObj;
  const OnboardPage({super.key, required this.onboardingDataObj});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            width: MediaQuery.of(context).size.width,
            padding: EdgeInsets.all(24),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: ColorManager.white.withValues(alpha: .1),
              ),
              color: ColorManager.white.withValues(alpha: 0.05),
            ),
            child: SvgPicture.asset(onboardingDataObj.onboardImage),
          ),
          SizedBox(height: 20),
          Container(
            width: MediaQuery.of(context).size.width,
            padding: EdgeInsets.all(24),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: ColorManager.white.withValues(alpha: .1),
              ),
              color: ColorManager.white.withValues(alpha: 0.05),
            ),
            child: Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 15,
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      padding: EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        color: context.read<OnboardingProvider>().color,
                      ),
                      child: SvgPicture.asset(ImageManager.location),
                    ),
                    Expanded(
                      child: Text(
                        onboardingDataObj.label,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 28,
                          color: ColorManager.white,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 25),
                Text(
                  onboardingDataObj.content,
                  textAlign: TextAlign.start,
                  style: TextStyle(
                    color: ColorManager.white.withValues(alpha: .7),
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 15),
                Column(
                  spacing: 10,
                  children: List.generate(onboardingDataObj.perks.length, (i) => OnboardingPerk(
                    text: onboardingDataObj.perks[i],
                  )),
                ),
                SizedBox(height: 20),
                context.watch<OnboardingProvider>().currentOnboardPage ==
                        context.watch<OnboardingProvider>().length - 1
                    ? Container(
                        width: MediaQuery.of(context).size.width,
                        padding: EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: ColorManager.red.withValues(alpha: .5),
                          ),
                          color: ColorManager.red.withValues(alpha: 0.05),
                        ),
                        child: Row(
                          spacing: 8,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(Icons.info_outline),
                            Expanded(
                              child: Text(
                                "Always call local emerygency services (112) directly in life-threatening situations. C-GUARD supplements but does not replace emergency services.",
                                textAlign: TextAlign.start,
                                style: TextStyle(
                                  color: ColorManager.white.withValues(
                                    alpha: .7,
                                  ),
                                  fontSize: 16,
                                ),
                              ),
                            ),
                          ],
                        ),
                      )
                    : SizedBox(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
