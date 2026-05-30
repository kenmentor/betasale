import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class WishlistScreen extends StatelessWidget {
  const WishlistScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Wishlist'),
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.surface,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.favorite_border,
                  size: 36, color: AppColors.textLight),
            ),
            const SizedBox(height: 16),
            const Text(
              'Your wishlist is empty',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            const Text(
              'Save items you love for later',
              style:
                  TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Cart'),
        automaticallyImplyLeading: false,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                color: AppColors.surface,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.shopping_bag_outlined,
                  size: 36, color: AppColors.textLight),
            ),
            const SizedBox(height: 16),
            const Text(
              'Your cart is empty',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary),
            ),
            const SizedBox(height: 8),
            const Text(
              'Add items to get started',
              style:
                  TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      {'icon': Icons.person_outline, 'label': 'Edit Profile'},
      {'icon': Icons.location_on_outlined, 'label': 'My Addresses'},
      {'icon': Icons.receipt_long_outlined, 'label': 'Order History'},
      {'icon': Icons.notifications_outlined, 'label': 'Notifications'},
      {'icon': Icons.help_outline, 'label': 'Help & Support'},
      {'icon': Icons.logout, 'label': 'Sign Out'},
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 24),
            // Avatar
            const CircleAvatar(
              radius: 44,
              backgroundColor: AppColors.surface,
              child: Icon(Icons.person, size: 44, color: AppColors.textLight),
            ),
            const SizedBox(height: 12),
            const Text(
              'Alex Johnson',
              style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary),
            ),
            const Text(
              'alex.johnson@email.com',
              style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 8),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.accent.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text(
                '✓ Verified Seller',
                style: TextStyle(
                    fontSize: 12,
                    color: AppColors.accent,
                    fontWeight: FontWeight.w600),
              ),
            ),
            const SizedBox(height: 32),
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: items.length,
                separatorBuilder: (_, __) =>
                    const Divider(color: AppColors.divider, height: 1),
                itemBuilder: (context, index) {
                  final item = items[index];
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(vertical: 4),
                    leading: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(item['icon'] as IconData,
                          size: 20, color: AppColors.textPrimary),
                    ),
                    title: Text(
                      item['label'] as String,
                      style: const TextStyle(
                          fontSize: 14, fontWeight: FontWeight.w500),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios,
                        size: 14, color: AppColors.textLight),
                    onTap: () {
                      if (item['label'] == 'Sign Out') {
                        Navigator.pushReplacementNamed(context, '/login');
                      }
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
