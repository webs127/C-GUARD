import 'package:c_guard/app/router/route_constants.dart';
import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/core/managers/image_manager.dart';
import 'package:c_guard/feature/navigation/home/widgets/permission_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatelessWidget {
  const new({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "GOOD MORNING",
                        style: TextStyle(
                          color: ColorManager.grey,
                          fontSize: 11,
                          letterSpacing: 1.32,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                      Text(
                        "Chioma",
                        style: TextStyle(
                          color: ColorManager.black1,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: ColorManager.green,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Icon(Icons.person_outline),
                  ),
                ],
              ),
              SizedBox(height: 24),
              Divider(thickness: 2, color: ColorManager.border),
              SizedBox(height: 15),
              Card.outlined(
                color: ColorManager.background,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 18,
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "CURRENT STATUS",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 14,
                                letterSpacing: 2,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            SizedBox(height: 18),
                            Text(
                              "No Active Journey",
                              style: TextStyle(
                                color: ColorManager.white,
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            SizedBox(height: 5),
                            Text(
                              "You are currently not ona monitored journey",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Icon(Icons.home),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 17),
              Card.outlined(
                color: ColorManager.white,
                shape: OutlineInputBorder(
                  borderSide: BorderSide(color: ColorManager.border),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 18,
                  ),
                  child: Row(
                    spacing: 12,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: ColorManager.green,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Icon(Icons.location_city_outlined),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "ASSIGNED CAMP",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 14,
                                letterSpacing: 2,
                                fontWeight: FontWeight.normal,
                              ),
                            ),
                            SizedBox(height: 7),
                            Text(
                              "Kubwa Orientation Camp",
                              style: TextStyle(
                                color: ColorManager.black1,
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            SizedBox(height: 5),
                            Text(
                              "Abuja State, Nigeria",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 14,
                                fontWeight: FontWeight.normal,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 17),
              Row(
                children: [
                  Expanded(
                    child: Card.outlined(
                      color: ColorManager.white,
                      shape: OutlineInputBorder(
                        borderSide: BorderSide(color: ColorManager.border),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 18,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Journeys completed",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 14,
                                fontWeight: FontWeight.normal,
                              ),
                            ),
                            SizedBox(height: 5),
                            Text(
                              "0",
                              style: TextStyle(
                                color: ColorManager.black1,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: Card.outlined(
                      color: ColorManager.white,
                      shape: OutlineInputBorder(
                        borderSide: BorderSide(color: ColorManager.border),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 18,
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Total Hours",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 14,
                                fontWeight: FontWeight.normal,
                              ),
                            ),
                            SizedBox(height: 5),
                            Text(
                              "0h",
                              style: TextStyle(
                                color: ColorManager.black1,
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 17),
              PermissionCard(
                title: "Location Access",
                icon: Icons.location_on_outlined,
                isEnabled: true,
              ),
              SizedBox(height: 4),
              PermissionCard(
                title: "Network Status",
                icon: Icons.wifi,
                isEnabled: false,
              ),
              SizedBox(height: 20),
              Text(
                "EMERGENCY",
                style: TextStyle(
                  color: ColorManager.grey,
                  fontSize: 16,
                  letterSpacing: 2,
                  fontWeight: FontWeight.normal,
                ),
              ),
              SizedBox(height: 12),
              MaterialButton(
                padding: EdgeInsets.all(18),
                shape: OutlineInputBorder(
                  borderSide: BorderSide.none,
                  borderRadius: BorderRadius.circular(13),
                ),
                onPressed: () {
                  context.pushNamed(RouteConstants.emergency);
                },
                color: ColorManager.red,
                child: Row(
                  spacing: 8,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SvgPicture.asset(
                      height: 18,
                      width: 18,
                      ImageManager.light,
                      color: ColorManager.white,
                    ),
                    Text(
                      "SOS Emergency",
                      style: TextStyle(
                        color: ColorManager.white,
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 11),
              Text(
                "Tap to alert monitoring personnel and emergency contacts with your location",
                style: TextStyle(color: ColorManager.grey, fontSize: 14),
              ),
              SizedBox(height: 21),
              Text(
                "RECENT ACTIVITY",
                style: TextStyle(
                  color: ColorManager.grey,
                  fontSize: 16,
                  letterSpacing: 2,
                  fontWeight: FontWeight.normal,
                ),
              ),
              SizedBox(height: 14),
              SizedBox(
                width: MediaQuery.of(context).size.width,
                child: Card.outlined(
                  color: ColorManager.white,
                  shape: OutlineInputBorder(
                    borderSide: BorderSide(color: ColorManager.border),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 38),
                    child: Column(
                      children: [
                        Icon(Icons.history_rounded, size: 30),
                        SizedBox(height: 17),
                        Text(
                          "No journeys yet",
                          style: TextStyle(
                            color: ColorManager.grey,
                            fontSize: 16,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                        Text(
                          "Your journey history will appear here",
                          style: TextStyle(
                            color: ColorManager.grey,
                            fontSize: 16,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
