import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/core/managers/image_manager.dart';
import 'package:c_guard/providers/onboarding_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:provider/provider.dart';

class OnboardingPerk extends StatelessWidget {
  final String text;
  const OnboardingPerk({super.key, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      spacing: 10,
      children: [
        Container(
          width: 20,
          height: 20,
          padding: EdgeInsets.all(4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(4.5),
            color: context.read<OnboardingProvider>().color,
          ),
          child: SvgPicture.asset(ImageManager.location),
        ),
        Text(
          text,
          style: TextStyle(
            fontSize: 16,
            color: ColorManager.white.withValues(alpha: .7),
          ),
        ),
      ],
    );
  }
}
