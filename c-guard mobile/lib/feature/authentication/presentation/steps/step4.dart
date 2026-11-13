import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_textformField.dart';
import 'package:flutter/material.dart';

class AuthStep4 extends StatelessWidget {
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Emergency\nContacts",
          style: TextStyle(
            color: ColorManager.black1,
            fontWeight: FontWeight.bold,
            fontSize: 36,
          ),
        ),
        SizedBox(height: 19),
        Text(
          "Who should we contact during an emergency?",
          style: TextStyle(color: ColorManager.grey, fontSize: 16),
        ),
        SizedBox(height: 40),
        Form(
          child: Column(
            spacing: 20,
            children: [
              CustomTextFormField(
                label: "PRIMARY CONTACT NAME",
                hintText: "E.g Bldr Shittu",
                prefix: Icon(Icons.person_outline),
              ),
              CustomTextFormField(
                label: "PRIMARY CONTACT PHONE",
                hintText: "+234 801 234 5678",
                prefix: Icon(Icons.phone_outlined),
              ),
              CustomTextFormField(
                label: "RELATIONSHIP",
                hintText: "Father",
                prefix: Icon(Icons.people_outlined),
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
            spacing: 3,
            children: [
              Checkbox.adaptive(
                value: true,
                activeColor: ColorManager.blue,
                shape: BeveledRectangleBorder(),
                onChanged: (value) {},
              ),
              Flexible(
                child: RichText(
                  text: TextSpan(
                    text: "I agree to C-GUARD ",
                    style: TextStyle(
                      color: ColorManager.black1,
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                    ),
                    children: [
                      TextSpan(
                        text: "Terms of Service",
                        style: TextStyle(
                          color: ColorManager.blue,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      TextSpan(text: " and "),
                      TextSpan(
                        text: "Privacy Policy",
                        style: TextStyle(
                          color: ColorManager.blue,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                // child: Text(
                //   "We'll send a verification link. Check your inbox.",
                //   style: TextStyle(
                //     color: ColorManager.black1,
                //     fontSize: 14,
                //     fontWeight: FontWeight.normal,
                //   ),
                // ),
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
            spacing: 3,
            children: [
              Checkbox.adaptive(
                value: true,
                activeColor: ColorManager.blue,
                shape: BeveledRectangleBorder(),
                onChanged: (value) {},
              ),
              Flexible(
                child: Text(
                  "I authorize C-GUARD to access my device location for journey monitoring",
                  style: TextStyle(
                    color: ColorManager.black1,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
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
