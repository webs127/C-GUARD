import 'package:flutter/material.dart';

extension HexColor on Color {
  static Color hexString(String color) {
    color = color.replaceAll("#", "");
    if (color.length == 6) {
      color = "FF$color";
    }
    return Color(int.parse(color, radix: 16));
  }
}

class ColorManager {
  static Color black = HexColor.hexString("#000000");
  static Color black1 = HexColor.hexString("#172033");
  static Color white = HexColor.hexString("#FFFFFF");
  static Color background = HexColor.hexString("#101D35");
  static Color whitebackground = HexColor.hexString("#F5F7FA");
  static Color background1 = HexColor.hexString("#172B4D");
  static Color blue = HexColor.hexString("#2563EB");
  static Color border = HexColor.hexString("#E2E8F0");
  static Color border1 = HexColor.hexString("#E2E8F0");
  static Color red = HexColor.hexString("#DC2626");
  static Color redfill = HexColor.hexString("#FEE2E2");
  static Color green = HexColor.hexString("#0D9488");
  static Color green1 = HexColor.hexString("#DCFCE7");
  static Color lightGreen = HexColor.hexString("#16A34A");
  static Color grey = HexColor.hexString("#64748B");
  static Color blueFill = HexColor.hexString("#DBEAFE");
  static Color yellow = HexColor.hexString("#D97706");
}