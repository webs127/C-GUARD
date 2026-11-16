import 'package:c_guard/core/managers/color_manager.dart';
import 'package:flutter/material.dart';

class CustomButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final Color? color;
  final Color? textcolor;
  final IconData? icon;
  final String text;
  final FontWeight? fontWeight;
  final Widget suffix;
  const CustomButton({
    super.key,
    this.onPressed,
    this.color,
    this.icon,
    required this.text,
    required this.suffix,
    this.fontWeight,
    this.textcolor,
  });

  @override
  Widget build(BuildContext context) {
    return MaterialButton(
      onPressed: onPressed,
      disabledColor: ColorManager.whitebackground,
      padding: EdgeInsets.all(16),
      color: color ?? ColorManager.whitebackground,
      elevation: 0,
      shape: OutlineInputBorder(
        borderSide: BorderSide(color: ColorManager.border),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            spacing: 8,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              icon == null
                  ? SizedBox()
                  : Icon(icon, color: ColorManager.black),
              Text(
                text,
                style: TextStyle(
                  color: textcolor ?? ColorManager.black,
                  fontSize: 15,
                  fontWeight: fontWeight,
                ),
              ),
            ],
          ),
          suffix,
        ],
      ),
    );
  }
}

class SuffixWidget extends StatelessWidget {
  final Color? color;
  final Color? textcolor;
  final String text;
  const SuffixWidget({super.key, this.color, required this.text, this.textcolor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color ?? ColorManager.green1,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: textcolor ?? ColorManager.green,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
