import 'package:c_guard/app/router/route_constants.dart';
import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_background.dart';
import 'package:c_guard/providers/auth_provider.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

class Authentication extends StatefulWidget {
  const new({super.key});

  @override
  State<Authentication> createState() => _AuthenticationState();
}

class _AuthenticationState extends State<Authentication> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: CustomBackGround(
          body: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Stack(
              children: [
                SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        spacing: 90,
                        children: [
                          BackButton(
                            onPressed:
                                context.read<AuthProvider>().currentStep == 0
                                ? null
                                : () => context
                                      .read<AuthProvider>()
                                      .previousStep(),
                            style: ButtonStyle(
                              backgroundColor: WidgetStatePropertyAll(
                                ColorManager.black.withValues(alpha: .05),
                              ),
                            ),
                          ),
                          Text(
                            "STEP ${context.watch<AuthProvider>().currentStep + 1} OF ${context.read<AuthProvider>().length}",
                            style: TextStyle(
                              color: ColorManager.grey,
                              letterSpacing: 2,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 8),
                      Row(
                        spacing: 6,
                        children: List.generate(
                          4,
                          (i) => Expanded(
                            child: AnimatedContainer(
                              duration: Durations.extralong1,
                              curve: Curves.linear,
                              height: 4,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(2),
                                color:
                                    i <=
                                        context
                                            .watch<AuthProvider>()
                                            .currentStep
                                    ? ColorManager.blue
                                    : ColorManager.grey,
                              ),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(height: 21),
                      context.watch<AuthProvider>().step,
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            MaterialButton(
              onPressed: context.watch<AuthProvider>().currentStep ==
                            context.watch<AuthProvider>().length - 1 ? () {
                              context.pushNamed(RouteConstants.accountCreated);
                            } : () {
                context.read<AuthProvider>().nextStep();
              },
              shape: OutlineInputBorder(
                borderSide: BorderSide.none,
                borderRadius: BorderRadius.circular(14),
              ),
              color: ColorManager.blue,
              padding: EdgeInsets.symmetric(vertical: 18),
              child: Row(
                spacing: 12,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    context.watch<AuthProvider>().currentStep ==
                            context.watch<AuthProvider>().length - 1
                        ? "Create Account"
                        : "Continue",
                    style: TextStyle(
                      color: ColorManager.white,
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Icon(
                    context.watch<AuthProvider>().currentStep ==
                            context.watch<AuthProvider>().length - 1
                        ? Icons.check
                        : Icons.arrow_forward,
                    color: ColorManager.white,
                  ),
                ],
              ),
            ),
            context.watch<AuthProvider>().currentStep == 0
                ? Column(
                    children: [
                      SizedBox(height: 20),
                      RichText(
                        text: TextSpan(
                          text: "Already Have an Account?",
                          style: TextStyle(
                            color: ColorManager.grey,
                            fontSize: 14,
                            fontWeight: FontWeight.w400,
                          ),
                          children: [
                            TextSpan(
                              text: " Login",
                              recognizer: TapGestureRecognizer()..onTap = () {},
                              style: TextStyle(
                                color: ColorManager.blue,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  )
                : SizedBox(),
          ],
        ),
      ),
    );
  }
}
