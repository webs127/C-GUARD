import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';

class PrecautionCard extends StatelessWidget {
  final int index;
  const PrecautionCard({super.key, required this.index});

  @override
  Widget build(BuildContext context) {
    return Card.outlined(
      color: ColorManager.white,
      shape: OutlineInputBorder(
        borderSide: BorderSide(color: ColorManager.border),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 15),
        child: Row(
          spacing: 13,
          children: [
            CircleAvatar(
              backgroundColor: ColorManager.red,
              child: Text(
                "${index + 1}",
                style: TextStyle(color: ColorManager.white),
              ),
            ),
            Flexible(
              child: Text(
                "Stay in a safe location and wait for responders",
                style: TextStyle(color: ColorManager.black1, fontSize: 13),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
