import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';

class InformationCard extends StatelessWidget {
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    return Card.outlined(
      color: ColorManager.white,
      shape: OutlineInputBorder(
        borderSide: BorderSide(color: ColorManager.border),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
        child: Row(
          children: [
            Column(
              spacing: 6,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Current Location",
                  style: TextStyle(
                    color: ColorManager.grey,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  "Abuja-Kaduna Expressway, Abuja",
                  style: TextStyle(
                    color: ColorManager.black1,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
