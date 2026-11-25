import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';

class CustomSwitchWidget extends StatefulWidget {
  bool isEnabled = false;
  CustomSwitchWidget({super.key, required this.isEnabled});

  @override
  State<CustomSwitchWidget> createState() => _CustomSwitchWidgetState();
}

class _CustomSwitchWidgetState extends State<CustomSwitchWidget> {
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        setState(() {
          widget.isEnabled = !widget.isEnabled;
        });
      },
      child: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              color: ColorManager.border,
              borderRadius: BorderRadius.circular(12),
            ),
            width: 48,
            height: 24,
          ),
          AnimatedContainer(
            duration: Durations.medium3,
            decoration: BoxDecoration(
              color: ColorManager.lightGreen,
              borderRadius: BorderRadius.circular(12),
            ),
            width: widget.isEnabled ? 48 : 0,
            height: 24,
          ),
        ],
      ),
    );
  }
}

class SettingsCard extends StatefulWidget {
  const new({super.key});

  @override
  State<SettingsCard> createState() => _SettingsCardState();
}

class _SettingsCardState extends State<SettingsCard> {
  @override
  Widget build(BuildContext context) {
    return Card.outlined(
      color: ColorManager.white,
      shape: OutlineInputBorder(
        borderSide: BorderSide(color: ColorManager.border),
        borderRadius: BorderRadius.circular(12)
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 10,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Flexible(
              child: Column(
                spacing: 5,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                      "Location Tracking",
                      style: TextStyle(
                        color: ColorManager.black1,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      "Allow C-GUARD to collect yout location data during journeys",
                      style: TextStyle(
                        color: ColorManager.grey,
                        fontSize: 13,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                ],
              ),
            ),
            CustomSwitchWidget(isEnabled: true)
          ],
        ),
      ),
    );
  }
}
