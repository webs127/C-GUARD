import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/core/managers/image_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_background.dart';
import 'package:c_guard/feature/emergency/widgets/infomation_card.dart';
import 'package:c_guard/feature/emergency/widgets/precaution_card.dart';
import 'package:c_guard/feature/widgets/info_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class EmergencyScreen extends StatefulWidget {
  const new({super.key});

  @override
  State<EmergencyScreen> createState() => _EmergencyScreenState();
}

class _EmergencyScreenState extends State<EmergencyScreen> {
  @override
  Widget build(BuildContext context) {
    return CustomBackGround(
      color: ColorManager.red,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "EMERGENCY ALERT",
                          style: TextStyle(
                            color: ColorManager.red,
                            fontSize: 11,
                            letterSpacing: 1.32,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                        Text(
                          "SOS Activated",
                          style: TextStyle(
                            color: ColorManager.red,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: ColorManager.redfill,
                        borderRadius: BorderRadius.circular(24)
                      ),
                      child: Row(
                        spacing: 5,
                        children: [
                          SvgPicture.asset(ImageManager.light, color: ColorManager.red,),
                          Text("LIVE", style: TextStyle(
                            color: ColorManager.red,
                            fontWeight: FontWeight.w500
                          ),)
                        ],
                      ),
                    )
                  ],
                ),
              ),
              Divider(color: ColorManager.red),
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Center(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      CircleAvatar(
                        radius: 60,
                        backgroundColor: ColorManager.red,
                        child: SvgPicture.asset(
                          ImageManager.light,
                          width: 40,
                          height: 40,
                        ),
                      ),
                      Text(
                        "Emergency Alert Sent",
                        style: TextStyle(
                          color: ColorManager.black1,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        "Help is on the way. Multiple parties have been notified of your locationand situation.",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: ColorManager.grey,
                          fontSize: 14,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 4,
                ),
                child: Card.filled(
                  color: ColorManager.red,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 24,
                    ),
                    child: Row(
                      spacing: 13,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 12,
                          ),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(14),
                            color: ColorManager.white,
                          ),
                          child: Icon(Icons.check),
                        ),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Notified Parties",
                                style: TextStyle(
                                  color: ColorManager.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 16),
                              Column(
                                spacing: 5,
                                children: List.generate(
                                  3,
                                  (i) => Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        "Local Emergency Services",
                                        style: TextStyle(
                                          color: ColorManager.white,
                                          fontSize: 15,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      Text(
                                        "SOS Activated",
                                        style: TextStyle(
                                          color: ColorManager.border,
                                          fontSize: 13,
                                          fontWeight: FontWeight.normal,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
                child: Column(
                  spacing: 12,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "YOUR INFORMATION",
                      style: TextStyle(
                        color: ColorManager.grey,
                        fontSize: 14,
                        letterSpacing: 0.66,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                    Column(
                      children: List.generate(3, (i) => InformationCard()),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 6,
                ),
                child: Column(
                  spacing: 12,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "NEXT STEPS",
                      style: TextStyle(
                        color: ColorManager.grey,
                        fontSize: 14,
                        letterSpacing: 0.66,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                    Column(
                      children: List.generate(
                        4,
                        (i) => PrecautionCard(index: i),
                      ),
                    ),
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
                                color: ColorManager.red,
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Icon(Icons.call_outlined),
                            ),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    "EMERGENCY CONTACT",
                                    style: TextStyle(
                                      color: ColorManager.grey,
                                      fontSize: 12,
                                      letterSpacing: 1.32,
                                      fontWeight: FontWeight.normal,
                                    ),
                                  ),
                                  SizedBox(height: 7),
                                  Column(
                                    spacing: 3,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "Mrs Okafor",
                                        style: TextStyle(
                                          color: ColorManager.white,
                                          fontSize: 14,
                                          fontWeight: FontWeight.normal,
                                        ),
                                      ),
                                      Text(
                                        "*234 802 978 6587",
                                        style: TextStyle(
                                          color: ColorManager.grey,
                                          fontSize: 13,
                                          fontWeight: FontWeight.normal,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    InfoWidget(
                      icon: Icons.info_outline,
                      text: "You can cancel this emergency alert at any time if you no longer need assistance.",
                    ),
                    SizedBox(height: 24),
                  ],
                ),
              ),
              Divider(),
              Padding(
                padding: EdgeInsetsGeometry.symmetric(
                  horizontal: 16,
                  vertical: 13,
                ),
                child: Column(
                  spacing: 13,
                  children: [
                    MaterialButton(
                      onPressed: () {},
                      padding: EdgeInsets.symmetric(
                        horizontal: 13,
                        vertical: 16,
                      ),
                      shape: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: BorderSide(color: ColorManager.border1),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "Call Emergency Contact",
                            style: TextStyle(
                              color: ColorManager.black1,
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          Icon(Icons.call_outlined),
                        ],
                      ),
                    ),
                    MaterialButton(
                      onPressed: () {},
                      padding: EdgeInsets.symmetric(
                        horizontal: 13,
                        vertical: 16,
                      ),
                      shape: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: BorderSide(color: ColorManager.border1),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Cancel Emergency Alert",
                            style: TextStyle(
                              color: ColorManager.black1,
                              fontSize: 15,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 20,)
            ],
          ),
        ),
      ),
    );
  }
}
