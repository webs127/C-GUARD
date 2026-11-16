import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';

class InfoWidget extends StatelessWidget {
  final String text;
  final IconData? icon;
  final Color? fill;
  final Color? border;
  final Color? textColor;
  const InfoWidget({
    super.key,
    required this.text,
    this.icon,
    this.fill,
    this.border,
    this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: fill ?? ColorManager.blueFill,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: border ?? ColorManager.blue),
      ),
      padding: EdgeInsets.all(12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: 8,
        children: [
          Icon(icon ?? Icons.info_outline, size: 14),
          Flexible(
            child: Text(
              text,
              style: TextStyle(
                color: textColor ?? ColorManager.blue,
                fontSize: 11,
                fontWeight: FontWeight.normal,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
