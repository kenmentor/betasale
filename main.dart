import 'package:beta_sale/screens/login_screen.dart';
import 'package:beta_sale/screens/main_scaffold.dart';
import 'package:beta_sale/screens/onboarding_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:beta_sale/theme/app_theme.dart';
import 'package:beta_sale/screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.dark,
  ));
  runApp(const BetaSaleApp());
}

class BetaSaleApp extends StatelessWidget {
  const BetaSaleApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BetaSale',
      debugShowCheckedModeBanner: false,
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
