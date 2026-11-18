import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_textformField.dart';
import 'package:c_guard/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AuthStep2 extends StatelessWidget {
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Secure your\nAccount",
          style: TextStyle(
            color: ColorManager.black1,
            fontWeight: FontWeight.bold,
            fontSize: 36,
          ),
        ),
        SizedBox(height: 19),
        Text(
          "Setup your contact details and password",
          style: TextStyle(color: ColorManager.grey, fontSize: 16),
        ),
        SizedBox(height: 40),
        Consumer<AuthProvider>(
          builder: (context, state, _) {
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 20,
              children: [
                CustomTextFormField(
                  label: "PHONE NUMBER",
                  controller: state.phoneNumber,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Required";
                    }
                    return null;
                  },
                  hintText: "+234 801 234 5678",
                  prefix: Icon(Icons.phone_outlined),
                ),
                CustomTextFormField(
                  controller: state.password,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Required";
                    }
                    if (value.length < 6) {
                      return "Must be greater than 6 characters";
                    }
                    return null;
                  },
                  label: "PASSWORD",
                  hintText: "David#123",
                  prefix: Icon(Icons.lock_outline),
                  obscureText: true,
                  suffix: InkWell(
                    onTap: () {},
                    borderRadius: BorderRadius.circular(50),
                    child: Icon(Icons.remove_red_eye),
                  ),
                ),
                Text(
                  "Minimun of 8 characters, including uppercase, lowercase, symbols, and numbers",
                  style: TextStyle(color: ColorManager.grey, fontSize: 14),
                ),
              ],
            );
          },
        ),
        SizedBox(height: 20),
        CustomTextFormField(
          label: "CONFIRM PASSWORD",
          hintText: "David#123",
          prefix: Icon(Icons.lock_outline),
          obscureText: true,
          suffix: InkWell(
            onTap: () {},
            borderRadius: BorderRadius.circular(50),
            child: Icon(Icons.remove_red_eye),
          ),
        ),
      ],
    );
  }
}
