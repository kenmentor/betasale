import 'package:beta_sale/screens/login_screen.dart';
import 'package:beta_sale/screens/main_scaffold.dart';
import 'package:beta_sale/screens/onboarding_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:beta_sale/theme/app_theme.dart';
import 'package:beta_sale/screens/splash_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'BetaSale',
      theme: AppTheme.theme,
      initialRoute: '/',
      routes: {
        '/': (_) => const SplashScreen(),
        '/onboarding': (_) => const OnboardingScreen(),
        '/login': (_) => const LoginScreen(),
        '/home': (_) => const MainScaffold(),
      },
    );
  }
}


