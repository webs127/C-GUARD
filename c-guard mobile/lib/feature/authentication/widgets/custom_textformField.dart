import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';

class CustomTextFormField extends StatelessWidget {
  final String? label;
  final Widget? prefix;
  final bool? enabled;
  final Widget? suffix;
  final String? hintText;
  final VoidCallback? onTap;
  final bool obscureText;
  final String? Function(String?)? validator;
  final Function(String)? onChanged;
  final TextEditingController? controller;
  const CustomTextFormField({
    super.key,
    this.label,
    this.prefix,
    this.suffix,
    this.hintText,
    this.controller,
    this.obscureText = false,
    this.enabled,
    this.onTap, this.validator, this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      spacing: 11,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label ?? "FULL NAME",
          style: TextStyle(
            color: ColorManager.black1,
            fontSize: 12,
            letterSpacing: 0.66,
            fontWeight: FontWeight.w600,
          ),
        ),
        TextFormField(
          controller: controller,
          enabled: enabled,
          validator: validator,
          onChanged: onChanged,
          autovalidateMode: AutovalidateMode.onUserInteraction,
          onTap: onTap,
          cursorColor: ColorManager.blue,
          obscureText: obscureText,
          decoration: InputDecoration(
            suffixIcon: suffix,
            prefixIcon: prefix,
            hintText: hintText,
            hintStyle: TextStyle(fontSize: 15, color: ColorManager.black1),
            border: OutlineInputBorder(
              borderSide: BorderSide(color: ColorManager.border),
              borderRadius: BorderRadius.circular(13.5),
            ),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(color: ColorManager.border),
              borderRadius: BorderRadius.circular(13.5),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(
                color: ColorManager.black.withValues(alpha: .2),
              ),
              borderRadius: BorderRadius.circular(13.5),
            ),
          ),
        ),
      ],
    );
  }
}
