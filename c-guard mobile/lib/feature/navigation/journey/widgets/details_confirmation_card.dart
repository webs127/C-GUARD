import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/core/managers/image_manager.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class DetailsConfirmationCard extends StatelessWidget {
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    return Card.outlined(
      color: ColorManager.background,
      shape: OutlineInputBorder(
        borderSide: BorderSide.none,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
        child: Column(
          spacing: 12,
          children: [
            Row(
              spacing: 13,
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(Icons.location_pin, color: ColorManager.black, size: 18),
                Expanded(
                  child: Column(
                    spacing: 6,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "ROUTE",
                        style: TextStyle(
                          color: ColorManager.grey,
                          fontSize: 14,
                          letterSpacing: 1.32,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        spacing: 7,
                        children: [
                          Text(
                            "Your Location",
                            style: TextStyle(
                              color: ColorManager.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Icon(
                            Icons.arrow_forward,
                            color: ColorManager.white,
                            size: 16,
                          ),
                          Flexible(
                            child: Text(
                              "Kubwa Orientation Camp ",
                              style: TextStyle(
                                color: ColorManager.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Divider(color: ColorManager.border1),
            Row(
              spacing: 13,
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(
                  Icons.calendar_today_outlined,
                  color: ColorManager.black,
                  size: 18,
                ),
                Expanded(
                  child: Column(
                    spacing: 6,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "DEPARTURE",
                        style: TextStyle(
                          color: ColorManager.grey,
                          fontSize: 14,
                          letterSpacing: 1.32,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                      Text(
                        "Today at 08:00 AM",
                        style: TextStyle(
                          color: ColorManager.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Divider(color: ColorManager.border1),
            Row(
              spacing: 13,
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                SvgPicture.asset(ImageManager.light, height: 18, width: 18),
                Expanded(
                  child: Column(
                    spacing: 6,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "DISTANCE & TIME",
                        style: TextStyle(
                          color: ColorManager.grey,
                          fontSize: 14,
                          letterSpacing: 1.32,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                      Text(
                        "42 KM - 2h 15m",
                        style: TextStyle(
                          color: ColorManager.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
