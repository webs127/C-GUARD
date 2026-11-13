import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_background.dart';
import 'package:c_guard/feature/navigation/journey/widgets/details_confirmation_card.dart';
import 'package:c_guard/feature/navigation/journey/widgets/requirement_card.dart';
import 'package:c_guard/feature/widgets/info_widget.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ReviewJourneyScreen extends StatefulWidget {
  const new({super.key});

  @override
  State<ReviewJourneyScreen> createState() => _ReviewJourneyScreenState();
}

class _ReviewJourneyScreenState extends State<ReviewJourneyScreen> {
  @override
  Widget build(BuildContext context) {
    return CustomBackGround(
      body: SafeArea(
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
                      "CONFIRM & START",
                      style: TextStyle(
                        color: ColorManager.grey,
                        fontSize: 11,
                        letterSpacing: 1.32,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                    Text(
                      "Review Journey",
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
                Row(
                  spacing: 9,
                  children: [
                    Container(
                      padding: EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: ColorManager.blue,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(Icons.check_circle_outline, size: 16),
                    ),
                    Text(
                      "Details Confirmed",
                      style: TextStyle(
                        color: ColorManager.black1,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  spacing: 16,
                  children: [
                    DetailsConfirmationCard(),
                    InfoWidget(
                      icon: Icons.remove_red_eye_outlined,
                      text: "NYSC monitoring personnel can view your real-time location during this journey.",
                    ),
                    Text(
                      "BEFORE YOU START",
                      style: TextStyle(
                        color: ColorManager.grey,
                        fontSize: 14,
                        letterSpacing: 0.66,
                        fontWeight: FontWeight.normal,
                      ),
                    ),
                    Consumer<RequirementCardProvider>(
                      builder: (context, state, _) {
                        return Column(
                          children: List.generate(
                            state.requirementCards.length,
                            (i) => RequirementCard(
                              requirementCardObj: state.requirementCards[i],
                            ),
                          ),
                        );
                      },
                    ),
                    InfoWidget(
                      icon: Icons.info_outline,
                      textColor: ColorManager.black1,
                      border: ColorManager.yellow,
                      fill: ColorManager.yellow.withValues(alpha: .1),
                      text: "Do not close the app while your journey is active. Monitoring will continue even with the screen off.",
                    ),
                    SizedBox(height: 24),
                    MaterialButton(
                      onPressed: () {},
                      padding: EdgeInsets.all(18),
                      shape: OutlineInputBorder(
                        borderSide: BorderSide.none,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      color: ColorManager.blue,
                      child: Row(
                        spacing: 11,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.play_arrow_outlined,
                            color: ColorManager.white,
                          ),
                          Text(
                            "Start Journey Now",
                            style: TextStyle(
                              color: ColorManager.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
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
        ),
      ),
    );
  }
}
