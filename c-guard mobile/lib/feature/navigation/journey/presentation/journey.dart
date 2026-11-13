import 'package:c_guard/app/router/route_constants.dart';
import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_textformField.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class JourneyScreen extends StatefulWidget {
  const new({super.key});

  @override
  State<JourneyScreen> createState() => _JourneyScreenState();
}

class _JourneyScreenState extends State<JourneyScreen> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "JOURNEY PLANNING",
                    style: TextStyle(
                      color: ColorManager.grey,
                      fontSize: 11,
                      letterSpacing: 1.32,
                      fontWeight: FontWeight.normal,
                    ),
                  ),
                  Text(
                    "Register Journey",
                    style: TextStyle(
                      color: ColorManager.black1,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 24),
              Divider(thickness: 2, color: ColorManager.border),
              SizedBox(height: 16),
              Container(
                decoration: BoxDecoration(
                  color: ColorManager.blueFill,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: ColorManager.blue),
                ),
                padding: EdgeInsets.all(12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 8,
                  children: [
                    Icon(Icons.info_outline, size: 14),
                    Flexible(
                      child: Text(
                        "Register your journey details before you depart. Your assigned camp will be pre-filled.",
                        style: TextStyle(
                          color: ColorManager.blue,
                          fontSize: 11,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 16),
              CustomTextFormField(
                label: "DESTINATION CAMP",
                prefix: Icon(Icons.location_city_outlined),
                suffix: Icon(Icons.lock_outline),
              ),
              SizedBox(height: 16),
              CustomTextFormField(
                label: "DEPARTURE LOCATION",
                prefix: Icon(Icons.location_on_outlined),
                suffix: Icon(Icons.location_searching),
                hintText: "Tap to search or use current location",
              ),
              SizedBox(height: 16),
              CustomTextFormField(
                label: "DEPARTURE DATE",
                prefix: Icon(Icons.calendar_today_outlined),
                suffix: Icon(Icons.arrow_drop_down_outlined),
                hintText: "Today at 08:00 AM",
              ),
              SizedBox(height: 16),
              CustomTextFormField(
                label: "EXPECTED ARRIVAL",
                prefix: Icon(Icons.lock_clock_outlined),
                suffix: Icon(Icons.arrow_drop_down_outlined),
                hintText: "Estimate travel time",
              ),
              SizedBox(height: 16),
              Container(
                decoration: BoxDecoration(
                  color: ColorManager.blue.withValues(alpha: .08),
                  borderRadius: BorderRadius.circular(14),
                ),
                padding: EdgeInsets.all(12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 8,
                  children: [
                    Icon(Icons.info_outline, size: 14),
                    Flexible(
                      child: Text(
                        "Your emergency contact will be notified that you are on a monitored journey",
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
              SizedBox(height: 16),
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
                              "Est. Distance",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 12,
                                fontWeight: FontWeight.normal,
                              ),
                            ),
                            SizedBox(height: 5),
                            Text(
                              "42 km",
                              style: TextStyle(
                                color: ColorManager.black1,
                                fontSize: 17,
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
                              "Est. Hours",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 12,
                                fontWeight: FontWeight.normal,
                              ),
                            ),
                            SizedBox(height: 5),
                            Text(
                              "2h 15m",
                              style: TextStyle(
                                color: ColorManager.black1,
                                fontSize: 17,
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
              SizedBox(height: 16),
              Card.outlined(
                color: ColorManager.background,
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
                          color: ColorManager.blue,
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Icon(Icons.map_outlined),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "JOURNEY SUMMARY",
                              style: TextStyle(
                                color: ColorManager.grey,
                                fontSize: 12,
                                letterSpacing: 1.32,
                                fontWeight: FontWeight.normal,
                              ),
                            ),
                            SizedBox(height: 7),
                            Text(
                              "Your location will be shared with NYSC monitoring personnel during this journey",
                              style: TextStyle(
                                color: ColorManager.white,
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
              SizedBox(height: 32),
              MaterialButton(
                onPressed: () {
                  context.pushNamed(RouteConstants.reviewJourney);
                },
                color: ColorManager.blue,
                padding: EdgeInsets.all(14),
                shape: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none
                ),
                child: Row(
                  spacing: 8,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Continue to confirmation",
                      style: TextStyle(
                        color: ColorManager.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Icon(Icons.arrow_forward, color: ColorManager.white, size: 16,),
                  ],
                ),
              ),
              SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }
}
