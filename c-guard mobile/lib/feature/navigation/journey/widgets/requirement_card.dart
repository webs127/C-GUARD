import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';

class RequirementCard extends StatelessWidget {
  final RequirementCardObj requirementCardObj;
  const RequirementCard({
    super.key, required this.requirementCardObj,
  });

  @override
  Widget build(BuildContext context) {
    return Card.outlined(
      shape: OutlineInputBorder(
        borderSide: BorderSide(color: ColorManager.border),
        borderRadius: BorderRadius.circular(13.5),
      ),
      color: ColorManager.white,
      child: Padding(
        padding: const EdgeInsets.all(8.5),
        child: Row(
          spacing: 8,
          children: [
            Checkbox.adaptive(
              value: requirementCardObj.value,
              checkColor: ColorManager.black,
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              visualDensity: VisualDensity(horizontal: -4, vertical: -4),
              onChanged: (value) {},
              activeColor: ColorManager.lightGreen,
            ),
            Icon(requirementCardObj.icon, size: 18),
            Text(
              requirementCardObj.text,
              style: TextStyle(
                color: ColorManager.black1,
                fontSize: 14,
                fontWeight: FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class RequirementCardObj {
  final IconData icon;
  final String text;
  bool value;

  new({required this.icon, required this.text, this.value = false});
}

class RequirementCardProvider with ChangeNotifier {
  final List<RequirementCardObj> requirementCards = [
    RequirementCardObj(
      icon: Icons.location_on_outlined,
      text: "Location access enabled",
      value: true
    ),
    RequirementCardObj(
      icon: Icons.wifi,
      text: "Device connected to network",
    ),
    RequirementCardObj(
      icon: Icons.battery_full_outlined,
      text: "Sufficient battery (>20%)",
    ),
    RequirementCardObj(
      icon: Icons.phone_outlined,
      text: "Emergency contacts saved",
    ),
  ];
}
