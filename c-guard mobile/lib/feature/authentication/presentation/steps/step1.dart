import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_textformField.dart';
import 'package:c_guard/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AuthStep1 extends StatelessWidget {
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Welcome to\nC-GUARD",
          style: TextStyle(
            color: ColorManager.black1,
            fontWeight: FontWeight.bold,
            fontSize: 36,
          ),
        ),
        SizedBox(height: 19),
        Text(
          "Create your account to get started with journey monitoring",
          style: TextStyle(color: ColorManager.grey, fontSize: 16),
        ),
        SizedBox(height: 40),
        Consumer<AuthProvider>(
          builder: (context, state, _) {
            return Column(
              spacing: 20,
              children: [
                CustomTextFormField(
                  controller: state.fullname,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Required";
                    }
                    return null;
                  },
                  prefix: Icon(Icons.person_outline),
                ),
                CustomTextFormField(
                  label: "EMAIL ADDRESS",
                  controller: state.email,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Required";
                    }
                    return null;
                  },
                  hintText: "davidshittu@gmail.com",
                  prefix: Icon(Icons.mail_outline),
                ),
              ],
            );
          },
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
