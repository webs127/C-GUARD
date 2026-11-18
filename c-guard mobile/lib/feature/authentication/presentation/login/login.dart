import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/feature/authentication/widgets/custom_background.dart';
import 'package:c_guard/feature/authentication/widgets/custom_textformField.dart';
import 'package:c_guard/providers/auth_provider.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  Widget build(BuildContext context) {
    return CustomBackGround(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Stack(
            children: [
              SingleChildScrollView(
                child: Consumer<AuthProvider>(
                  builder: (context, state, _) {
                    return Form(
                      key: state.formKey,
                      child: Column(
                        spacing: 16,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          SizedBox(height: 16),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Welcome Back",
                                style: TextStyle(
                                  color: ColorManager.black1,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 36,
                                ),
                              ),
                              Text(
                                "Sign in to your account to continue",
                                style: TextStyle(
                                  color: ColorManager.grey,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 16),
                          Form(
                            child: Column(
                              spacing: 16,
                              children: [
                                CustomTextFormField(
                                  controller: state.email,
                                  label: "EMAIL ADDRESS",
                                  hintText: "davidshittu@gmail.com",
                                  prefix: Icon(Icons.mail_outline),
                                ),
                                CustomTextFormField(
                                  controller: state.password,
                                  label: "PASSWORD",
                                  obscureText: true,
                                  suffix: IconButton(
                                    onPressed: () {},
                                    icon: Icon(Icons.remove_red_eye_outlined),
                                  ),
                                  prefix: Icon(Icons.lock_outlined),
                                ),
                              ],
                            ),
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Checkbox.adaptive(
                                    value: false,
                                    onChanged: (value) {},
                                  ),
                                  Text(
                                    "Remember me",
                                    style: TextStyle(
                                      color: ColorManager.grey,
                                      fontSize: 14,
                                      fontWeight: FontWeight.normal,
                                    ),
                                  ),
                                ],
                              ),
                              Text(
                                "Forgot Password?",
                                style: TextStyle(
                                  color: ColorManager.blue,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 100,),
                          Column(
                            spacing: 16,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              MaterialButton(
                                color: ColorManager.blue,
                                padding: EdgeInsets.symmetric(vertical: 16),
                                onPressed: () {},
                                shape: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(14),
                                  borderSide: BorderSide.none,
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      "Sign In",
                                      style: TextStyle(
                                        color: ColorManager.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Row(
                                spacing: 6,
                                children: [
                                  Expanded(child: Divider()),
                                  Text(
                                    "Or",
                                    style: TextStyle(
                                      color: ColorManager.grey,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  Expanded(child: Divider()),
                                ],
                              ),
                              MaterialButton(
                                elevation: 0,
                                color: ColorManager.white,
                                padding: EdgeInsets.symmetric(vertical: 16),
                                onPressed: () {},
                                shape: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(14),
                                  borderSide: BorderSide(color: ColorManager.border),
                                ),
                                child: Row(
                                  spacing: 6,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.phone_android),
                                    Text(
                                      "Continue with Biometric",
                                      style: TextStyle(
                                        color: ColorManager.black1,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                          SizedBox(height: 4,),
                              Center(
                                child: RichText(
                                text: TextSpan(
                                  text: context.watch<AuthProvider>().isLogin ?  "Don't Have an Account?" : "Already Have an Account?",
                                  style: TextStyle(
                                    color: ColorManager.grey,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w400,
                                  ),
                                  children: [
                                    TextSpan(
                                      text:context.watch<AuthProvider>().isLogin ?  " Register" : " Login",
                                      recognizer: TapGestureRecognizer()..onTap = () {
                                        context.read<AuthProvider>().onLoginChanged();
                                      },
                                      style: TextStyle(
                                        color: ColorManager.blue,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                                                      ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
