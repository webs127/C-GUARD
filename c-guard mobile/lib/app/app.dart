import 'package:c_guard/app/router/router.dart';
import 'package:c_guard/feature/navigation/journey/widgets/requirement_card.dart';
import 'package:c_guard/providers/auth_provider.dart';
import 'package:c_guard/providers/main_navigation_provider.dart';
import 'package:c_guard/providers/onboarding_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => OnboardingProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => MainNavigationProvider()),
        ChangeNotifierProvider(create: (_) => RequirementCardProvider()),
      ],
      child: MaterialApp.router(
        title: 'C-GUARD',
        debugShowCheckedModeBanner: false,
        scrollBehavior: const _AppScrollBehavior(),
        routeInformationProvider: AppRouter.router.routeInformationProvider,
        routeInformationParser: AppRouter.router.routeInformationParser,
        routerDelegate: AppRouter.router.routerDelegate,
      ),
    );
  }
}

class _AppScrollBehavior extends ScrollBehavior {
  const _AppScrollBehavior();

  @override
  ScrollPhysics getScrollPhysics(BuildContext context) {
    return const BouncingScrollPhysics();
  }
}
