import 'package:c_guard/core/managers/color_manager.dart';
import 'package:c_guard/core/managers/image_manager.dart';
import 'package:c_guard/providers/auth_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart' show SvgPicture;
import 'package:provider/provider.dart';

class ProfileScreen extends StatefulWidget {
  const new({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        child: Column(
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
                        "YOUR ACCOUNT",
                        style: TextStyle(
                          color: ColorManager.grey,
                          fontSize: 11,
                          letterSpacing: 1.32,
                          fontWeight: FontWeight.normal,
                        ),
                      ),
                      Text(
                        "Profile",
                        style: TextStyle(
                          color: ColorManager.black1,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: ColorManager.green,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      spacing: 5,
                      children: [Icon(Icons.settings_outlined)],
                    ),
                  ),
                ],
              ),
            ),
            Divider(color: ColorManager.border),
            ProfileCard(),
            PersonalInfoWrapperCard(
              headerText: "PERSONAL INFORMATION",
              infos: [
                {"title": "Full Name", "value": context.read<AuthProvider>().corpMember?.fullname ?? "" },
                {"title": "Email", "value": context.read<AuthProvider>().corpMember?.email ?? ""},
                {"title": "Phone", "value": context.read<AuthProvider>().corpMember?.phoneNumber ?? ""},
              ],
            ),
            PersonalInfoWrapperCard(
              headerText: "NYSC ASSIGNMENT",
              infos: [
                {
                  "title": "Batch",
                  "value":
                      context.read<AuthProvider>().corpMember?.batch ??
                      "No Batch Yet",
                },
                {
                  "title": "Assigned Camp",
                  "value":
                      context
                          .read<AuthProvider>()
                          .corpMember
                          ?.orientationCamp ??
                      "No Camp Yet",
                },
                {
                  "title": "Service State",
                  "value":
                      context.read<AuthProvider>().corpMember?.assignedState ??
                      "No State Yet",
                },
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class PersonalInfoWrapperCard extends StatelessWidget {
  final String headerText;
  final List<Map<String, String>> infos;
  const PersonalInfoWrapperCard({
    super.key,
    required this.headerText,
    required this.infos,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
      child: Column(
        spacing: 16,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            headerText,
            style: TextStyle(color: ColorManager.grey, letterSpacing: 1.32),
          ),
          Column(
            spacing: 9,
            children: List.generate(3, (i) {
              return PeresonalInfoCard(infos: infos[i]);
            }),
          ),
        ],
      ),
    );
  }
}

class PeresonalInfoCard extends StatelessWidget {
  final Map<String, String> infos;
  const PeresonalInfoCard({super.key, required this.infos});

  @override
  Widget build(BuildContext context) {
    return Card.outlined(
      margin: EdgeInsetsGeometry.zero,
      color: ColorManager.white,
      shape: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide(color: ColorManager.border),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Column(
                spacing: 12,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    infos['title']!,
                    style: TextStyle(color: ColorManager.grey),
                  ),
                  Text(
                    infos['value']!,
                    style: TextStyle(
                      color: ColorManager.black,
                      fontWeight: FontWeight.w500,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios, size: 18),
          ],
        ),
      ),
    );
  }
}

class ProfileCard extends StatelessWidget {
  const new({super.key});

  @override
  Widget build(BuildContext context) {
    return Card.outlined(
      margin: EdgeInsets.all(16),
      shape: OutlineInputBorder(
        borderSide: BorderSide.none,
        borderRadius: BorderRadius.circular(14),
      ),
      color: ColorManager.background,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: 16,
          children: [
            CircleAvatar(
              radius: 44,
              backgroundColor: ColorManager.blue,
              child: Icon(
                Icons.person_outline,
                size: 40,
                color: ColorManager.black,
              ),
            ),
            Expanded(
              child: Column(
                spacing: 12,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    context.read<AuthProvider>().corpMember?.fullname ?? "",
                    style: TextStyle(
                      color: ColorManager.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    "NYSC Corps Member . Class of 2026",
                    style: TextStyle(
                      color: ColorManager.grey,
                      fontWeight: FontWeight.normal,
                      fontSize: 14,
                    ),
                  ),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: ColorManager.green),
                      color: ColorManager.green1,
                    ),
                    child: Text(
                      "Verfied",
                      style: TextStyle(color: ColorManager.green),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
