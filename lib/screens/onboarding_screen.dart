import 'package:flutter/material.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../models/product.dart';
import '../theme/app_theme.dart';
import 'package:google_fonts/google_fonts.dart';
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < AppData.onboardingData.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    } else {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          PageView.builder(
            controller: _pageController,
            itemCount: AppData.onboardingData.length,
            onPageChanged: (i) => setState(() => _currentPage = i),
            itemBuilder: (context, index) {
              final data = AppData.onboardingData[index];
              return _OnboardingPage(
                title: data['title'],
                subtitle: data['subtitle'],
                size: size,
                image: data['image'],
              );
            },
          ),
          // Bottom bar
          Positioned(
            bottom: 30,
            left: 0,
            right: 0,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SmoothPageIndicator(
                  controller: _pageController,
                  count: AppData.onboardingData.length,
                  effect: ExpandingDotsEffect(
                    activeDotColor: AppColors.accent,
                    dotColor: Colors.black,
                    dotHeight: 8,
                    dotWidth: 8,
                    expansionFactor: 3,
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: ElevatedButton(
                      onPressed: _nextPage,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: AppColors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                      child: Text(
                        _currentPage == AppData.onboardingData.length - 1
                            ? 'Start Shopping'
                            : _currentPage == 0
                                ? 'Get Started'
                                : 'Continue',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          // Skip button
          Positioned(
            top: MediaQuery.of(context).padding.top + 5,
            right: 24,
            child: _currentPage < AppData.onboardingData.length - 1
                ? TextButton(
                    onPressed: () =>
                        Navigator.pushReplacementNamed(context, '/login'),
                    child: Text(
                      'Skip',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  )
                : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}

class _OnboardingPage extends StatelessWidget {
  final String image;
  final String title;
  final String subtitle;
  final Size size;

  const _OnboardingPage({
    super.key,
    required this.image,
    required this.title,
    required this.subtitle,
    required this.size,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Fixed spacing from the top (Clears the status bar and the 'Skip' button nicely)
          SizedBox(height: MediaQuery.of(context).padding.top + 80),
          
          // 2. Text Section (Now sits naturally near the top)
          Text(
            title,
            style: const TextStyle(
              fontFamily:'Inter' ,
              fontSize: 40,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            subtitle,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 18,
              color: AppColors.textPrimary,
              height: 1.6,
            ),
          ),
          
          // 3. Image Section (Expands to fill all the remaining space in the middle)
          Expanded(
            child: Padding(
              // Adds a gap above the image and keeps it safely above your bottom buttons
              padding: const EdgeInsets.only(top: 40, bottom: 160),
              child: Center(
                child: Image.asset(
                  image,
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}