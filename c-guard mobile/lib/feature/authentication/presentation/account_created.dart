import 'package:c_guard/app/router/route_constants.dart';
import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_background.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AccountCreated extends StatefulWidget {
  const new({super.key});

  @override
  State<AccountCreated> createState() => _AccountCreatedState();
}

class _AccountCreatedState extends State<AccountCreated> {
  @override
  Widget build(BuildContext context) {
    final List<String> data = [
      "Verify your email address",
      "Set location permissions on your device",
      "Complete your profile verification",
      "Start your journey",
    ];
    return CustomBackGround(
      color: ColorManager.green,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Column(
                    children: [
                      CircleAvatar(
                        radius: 50,
                        backgroundColor: ColorManager.lightGreen,
                        child: Icon(
                          Icons.check,
                          size: 42,
                          color: ColorManager.black1,
                        ),
                      ),
                      SizedBox(height: 30),
                      Text(
                        "Account\nCreated!",
                        style: TextStyle(
                          fontSize: 32,
                          color: ColorManager.black1,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 12),
                      Text(
                        "Welcome to C-GUARD, David",
                        style: TextStyle(
                          color: ColorManager.grey,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 17),
                Card.outlined(
                  color: ColorManager.green1,
                  shape: OutlineInputBorder(
                    borderSide: BorderSide(color: ColorManager.green),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(17),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Checkbox.adaptive(
                          value: true,
                          onChanged: (value) {},
                          activeColor: ColorManager.green,
                          checkColor: ColorManager.black,
                        ),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Verification link sent",
                                style: TextStyle(
                                  color: ColorManager.lightGreen,
                                  fontWeight: FontWeight.w700,
                                  fontSize: 16,
                                ),
                              ),
                              Text(
                                "Check your email for a verification link to complete your registration",
                                style: TextStyle(
                                  color: ColorManager.lightGreen,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(height: 37),
                Text(
                  "What happens next?",
                  style: TextStyle(
                    color: ColorManager.black1,
                    fontWeight: FontWeight.w700,
                    fontSize: 20,
                  ),
                ),
                SizedBox(height: 14),
                Column(
                  spacing: 12,
                  children: List.generate(
                    4,
                    (i) => Row(
                      spacing: 12,
                      children: [
                        CircleAvatar(
                          backgroundColor: ColorManager.blue,
                          child: Text(
                            "${i + 1}",
                            style: TextStyle(color: ColorManager.white),
                          ),
                        ),
                        Text(
                          data[i],
                          style: TextStyle(
                            color: ColorManager.black1,
                            fontSize: 16,
                            fontWeight: FontWeight.normal,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(height: 34),
                MaterialButton(
                  color: ColorManager.blue,
                  shape: OutlineInputBorder(
                    borderSide: BorderSide.none,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  padding: EdgeInsets.all(16),
                  onPressed: () {},
                  child: Row(
                    spacing: 9,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Open Email",
                        style: TextStyle(
                          color: ColorManager.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Icon(Icons.mail_outline, color: ColorManager.white),
                    ],
                  ),
                ),
                SizedBox(height: 13),
                MaterialButton(
                  shape: OutlineInputBorder(
                    borderSide: BorderSide(color: ColorManager.blue),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  padding: EdgeInsets.all(16),
                  onPressed: () {
                    context.pushNamed(RouteConstants.mainNavigation);
                  },
                  child: Row(
                    spacing: 9,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Continue to Dashboard",
                        style: TextStyle(
                          color: ColorManager.blue,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
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
    );
  }
}
