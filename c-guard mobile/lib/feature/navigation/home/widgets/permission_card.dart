import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';

class PermissionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final bool isEnabled;
  const PermissionCard({
    super.key,
    required this.title,
    required this.icon,
    required this.isEnabled,
  });

  @override
  Widget build(BuildContext context) {
    return Card.outlined(
      color: ColorManager.white,
      shape: OutlineInputBorder(
        borderSide: BorderSide(color: ColorManager.border),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              spacing: 9,
              children: [
                Icon(icon),
                Text(
                  title,
                  style: TextStyle(
                    color: ColorManager.black1,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            SizedBox(height: 5),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 8.9, vertical: 5),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                color: ColorManager.green1,
              ),
              child: Text(
                isEnabled ? "Enabled" : "Not Enabled",
                style: TextStyle(
                  color: ColorManager.lightGreen,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
