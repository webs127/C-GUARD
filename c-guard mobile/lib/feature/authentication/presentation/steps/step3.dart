import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_textformField.dart';
import 'package:c_guard/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AuthStep3 extends StatefulWidget {
  const new({super.key});

  @override
  State<AuthStep3> createState() => _AuthStep3State();
}

class _AuthStep3State extends State<AuthStep3> {
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
          style: TextStyle(color: ColorManager.grey, fontSize: 16),
        ),
        SizedBox(height: 40),
        Consumer<AuthProvider>(
          builder: (context, state, _) {
            return Column(
              spacing: 20,
              children: [
                CustomTextFormField(
                  controller: state.callUpNumber,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Required";
                    }
                    return null;
                  },
                  onChanged: (value) {
                    if (value.length == 19) {
                      context.read<AuthProvider>().getCorpMemberData();
                    }
                  },
                  label: "CALL-UP NUMBER",
                  hintText: "NYSC/FUM/2026/1234",
                  prefix: Icon(Icons.tag_outlined),
                ),
                CustomTextFormField(
                  controller: state.assignedState,
                  enabled: false,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Required";
                    }
                    return null;
                  },
                  suffix: context.watch<AuthProvider>().isloading
                      ? Padding(
                          padding: EdgeInsetsGeometry.all(10),
                          child: CircularProgressIndicator(
                            color: ColorManager.blue,
                          ),
                        )
                      : null,
                  label: "ASSIGNED STATE",
                  hintText: "ABUJA (FC)",
                  prefix: Icon(Icons.map_outlined),
                ),
                CustomTextFormField(
                  controller: state.orientationCamp,
                  enabled: false,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Required";
                    }
                    return null;
                  },
                  suffix: context.watch<AuthProvider>().isloading
                      ? Padding(
                          padding: EdgeInsetsGeometry.all(10),
                          child: CircularProgressIndicator(
                            color: ColorManager.blue,
                          ),
                        )
                      : null,
                  label: "ORIENTATION CAMP",
                  hintText: "Kubwa Orientation Camp",
                  prefix: Icon(Icons.location_city_outlined),
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
