import 'package:c_guard/feature/authentication/presentation/account_created.dart';
import 'package:c_guard/feature/authentication/presentation/authentication.dart';
import 'package:c_guard/feature/emergency/presentation/emergency.dart';
import 'package:c_guard/feature/navigation/history/presentation/history.dart';
import 'package:c_guard/feature/navigation/home/presentation/home.dart';
import 'package:c_guard/feature/navigation/journey/presentation/journey.dart';
import 'package:c_guard/feature/navigation/journey/presentation/review_journey.dart';
import 'package:c_guard/feature/navigation/main_navigation.dart';
import 'package:c_guard/feature/navigation/profile/presentation/profile.dart';
import 'package:c_guard/feature/onboarding/presentation/onboarding.dart';
import 'package:c_guard/feature/splash/presentation/splash.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'route_constants.dart';

class AppRouter {
  static final _rootNavigatorKey = GlobalKey<NavigatorState>();
  static GlobalKey<NavigatorState> get navigatorKey => _rootNavigatorKey;
  //static final _shellNavigatorKey = GlobalKey<NavigatorState>();

  static final GoRouter _router = GoRouter(
    debugLogDiagnostics: true,
    initialLocation: '/',
    navigatorKey: _rootNavigatorKey,
    routes: [
      GoRoute(
        path: '/',
        name: RouteConstants.splash,
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const SplashScreen(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
      GoRoute(
        path: '/onboarding',
        name: RouteConstants.onboarding,
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const OnboardingScreen(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
      GoRoute(
        path: '/auth',
        name: RouteConstants.auth,
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const Authentication(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
      GoRoute(
        path: '/auth/account-created',
        name: RouteConstants.accountCreated,
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const AccountCreated(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
      GoRoute(
        path: '/main-navigation',
        name: RouteConstants.mainNavigation,
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const MainNavigationScreen(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
      GoRoute(
        path: '/home',
        name: RouteConstants.home,
        routes: [
                GoRoute(
        path: '/emergency',
        name: RouteConstants.emergency,
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const EmergencyScreen(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
        ],
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const HomeScreen(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
      GoRoute(
        path: '/journey',
        routes: [
          GoRoute(
            path: '/review-journey',
            name: RouteConstants.reviewJourney,
            pageBuilder: (context, state) {
              return CustomTransitionPage(
                key: state.pageKey,
                child: const ReviewJourneyScreen(),
                transitionsBuilder:
                    (context, animation, secondaryAnimation, child) {
                      return FadeTransition(
                        opacity: CurveTween(curve: Curves.easeInOutCirc)
                            .animate(animation),
                        child: child,
                      );
                    },
              );
            },
          ),
        ],
        name: RouteConstants.journey,
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const JourneyScreen(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
      GoRoute(
        path: '/history',
        name: RouteConstants.history,
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const HistoryScreen(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
      GoRoute(
        path: '/profile',
        name: RouteConstants.profile,
        pageBuilder: (context, state) {
          return CustomTransitionPage(
            key: state.pageKey,
            child: const ProfileScreen(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
                  return FadeTransition(
                    opacity: CurveTween(curve: Curves.easeInOutCirc)
                        .animate(animation),
                    child: child,
                  );
                },
          );
        },
      ),
    ],
  );

  static GoRouter get router => _router;
}
