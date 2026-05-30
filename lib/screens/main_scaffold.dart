import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'home_screen.dart';
import 'categories_screen.dart';
import 'secondary_screens.dart';
import 'order_screen.dart';

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});

  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;

  // Indices: 0=Home, 1=Category, 2=Orders, 3=Profile
  final List<Widget> _screens = const [
    HomeScreen(),
    CategoriesScreen(),
    OrdersScreen(),
    ProfileScreen(),
  ];

  void _onAddTapped() {
    // Handle add/plus button action
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: _BottomNavBar(
        currentIndex: _currentIndex,
        onTabChanged: (i) => setState(() => _currentIndex = i),
        onAddTapped: _onAddTapped,
      ),
    );
  }
}

class _BottomNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTabChanged;
  final VoidCallback onAddTapped;

  const _BottomNavBar({
    required this.currentIndex,
    required this.onTabChanged,
    required this.onAddTapped,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.background,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 16,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          height: 64,
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Row(
                children: [
                  // Left two tabs: Home, Category
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _NavItem(
                          icon: Icons.home_outlined,
                          activeIcon: Icons.home,
                          label: 'Home',
                          isActive: currentIndex == 0,
                          onTap: () => onTabChanged(0),
                        ),
                        _NavItem(
                          icon: Icons.grid_view_outlined,
                          activeIcon: Icons.grid_view,
                          label: 'Category',
                          isActive: currentIndex == 1,
                          onTap: () => onTabChanged(1),
                        ),
                      ],
                    ),
                  ),

                  // Center spacer for the FAB
                  const SizedBox(width: 72),

                  // Right two tabs: Orders, Profile
                  Expanded(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _NavItem(
                          icon: Icons.receipt_long_outlined,
                          activeIcon: Icons.receipt_long,
                          label: 'Orders',
                          isActive: currentIndex == 2,
                          onTap: () => onTabChanged(2),
                        ),
                        _NavItem(
                          icon: Icons.person_outline,
                          activeIcon: Icons.person,
                          label: 'Profile',
                          isActive: currentIndex == 3,
                          onTap: () => onTabChanged(3),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // Center elevated FAB
              Positioned(
                top: -20,
                left: 0,
                right: 0,
                child: Center(
                  child: GestureDetector(
                    onTap: onAddTapped,
                    child: Container(
                      width: 58,
                      height: 58,
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primary.withOpacity(0.35),
                            blurRadius: 14,
                            spreadRadius: 2,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.add,
                        color: Colors.white,
                        size: 30,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: isActive
                    ? AppColors.primary.withOpacity(0.08)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                isActive ? activeIcon : icon,
                size: 22,
                color: isActive ? AppColors.primary : AppColors.textLight,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                color: isActive ? AppColors.primary : AppColors.textLight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}