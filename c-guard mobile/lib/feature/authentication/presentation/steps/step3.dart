import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_textformField.dart';
import 'package:flutter/material.dart';

class AuthStep3 extends StatelessWidget {
  const new({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "NYSC Service\nInformation",
          style: TextStyle(
            color: ColorManager.black1,
            fontWeight: FontWeight.bold,
            fontSize: 36,
          ),
        ),
        SizedBox(height: 19),
        Text(
          "Fill in your NYSC details",
          style: TextStyle(
            color: ColorManager.grey,
            fontSize: 16,
          ),
        ),
        SizedBox(height: 40),
        Form(
          child: Column(
            spacing: 20,
            children: [
              CustomTextFormField(
                label: "CALL-UP NUMBER",
                hintText: "FC/26C/1234",
                prefix: Icon(Icons.tag_outlined),
              ),
              CustomTextFormField(
                label: "ASSIGNED STATE",
                hintText: "ABUJA (FC)",
                prefix: Icon(Icons.map_outlined),
              ),
              CustomTextFormField(
                label: "ORIENTATION CAMP",
                hintText: "Kubwa Orientation Camp",
                prefix: Icon(Icons.location_city_outlined),
              ),
            ],
          ),
        ),
        SizedBox(height: 17),
        Container(
          decoration: BoxDecoration(
            color: ColorManager.blue.withValues(alpha: .08),
            borderRadius: BorderRadius.circular(14),
          ),
          padding: EdgeInsets.all(12),
          child: Row(
            spacing: 8,
            children: [
              Icon(Icons.info_outline),
              Flexible(
                child: Text(
                  "We'll send a verification link. Check your inbox.",
                  style: TextStyle(
                    color: ColorManager.black1,
                    fontSize: 14,
                    fontWeight: FontWeight.normal,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
