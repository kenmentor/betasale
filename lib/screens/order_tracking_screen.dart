import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

enum TrackingStatus { paymentSecured, sellerShipping, deliveryConfirmation, fundsReleased }

class OrderTrackingScreen extends StatefulWidget {
  final String orderId;

  const OrderTrackingScreen({super.key, required this.orderId});

  @override
  State<OrderTrackingScreen> createState() => _OrderTrackingScreenState();
}

class _OrderTrackingScreenState extends State<OrderTrackingScreen> {
  TrackingStatus _currentStatus = TrackingStatus.sellerShipping;
  bool _showDisputeSheet = false;

  final List<Map<String, dynamic>> _trackingSteps = [
    {
      'status': TrackingStatus.paymentSecured,
      'title': 'Payment Secured',
      'subtitle': 'Funds are held safely in escrow',
      'time': 'May 24, 2026 · 10:32 AM',
      'icon': Icons.lock,
      'color': const Color(0xFF4CAF50),
    },
    {
      'status': TrackingStatus.sellerShipping,
      'title': 'Seller Shipping',
      'subtitle': 'Package is in transit via FedEx',
      'time': 'May 25, 2026 · 2:14 PM',
      'icon': Icons.local_shipping_outlined,
      'color': const Color(0xFF2196F3),
    },
    {
      'status': TrackingStatus.deliveryConfirmation,
      'title': 'Delivery Confirmation',
      'subtitle': 'Confirm receipt to release payment',
      'time': 'Pending',
      'icon': Icons.inventory_2_outlined,
      'color': const Color(0xFFFF9800),
    },
    {
      'status': TrackingStatus.fundsReleased,
      'title': 'Funds Released',
      'subtitle': 'Transaction closed successfully',
      'time': 'Pending',
      'icon': Icons.payments_outlined,
      'color': const Color(0xFF9C27B0),
    },
  ];

  bool _isStepDone(TrackingStatus step) =>
      step.index < _currentStatus.index;

  bool _isStepActive(TrackingStatus step) =>
      step.index == _currentStatus.index;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.divider),
                      ),
                      child: const Icon(Icons.arrow_back_ios_new,
                          size: 16, color: AppColors.textPrimary),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Track Order',
                            style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary)),
                        Text(widget.orderId,
                            style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                  // Escrow protected badge
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF4CAF50).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                          color: const Color(0xFF4CAF50).withOpacity(0.3)),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.verified_user,
                            size: 12, color: Color(0xFF4CAF50)),
                        SizedBox(width: 4),
                        Text('Escrow',
                            style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF4CAF50))),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 20),

                    // Order info card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.divider),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Container(
                              width: 60,
                              height: 64,
                              color: AppColors.surface,
                              child: const Icon(Icons.inventory_2_outlined,
                                  color: AppColors.textLight, size: 28),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Sony WH-1000XM5 Wireless',
                                    style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.textPrimary)),
                                const SizedBox(height: 2),
                                const Text('Condition: New · Qty: 1',
                                    style: TextStyle(
                                        fontSize: 12,
                                        color: AppColors.textSecondary)),
                                const SizedBox(height: 6),
                                const Text('₦348,000',
                                    style: TextStyle(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.textPrimary)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Transaction status
                    const Text('Transaction Status',
                        style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary)),
                    const SizedBox(height: 16),

                    // Tracking steps
                    ...List.generate(_trackingSteps.length, (index) {
                      final step = _trackingSteps[index];
                      final status = step['status'] as TrackingStatus;
                      final isDone = _isStepDone(status);
                      final isActive = _isStepActive(status);
                      final isLast = index == _trackingSteps.length - 1;
                      final color = step['color'] as Color;

                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Timeline column
                          Column(
                            children: [
                              AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: isDone
                                      ? color
                                      : isActive
                                          ? color.withOpacity(0.15)
                                          : AppColors.surface,
                                  border: Border.all(
                                    color: isDone || isActive
                                        ? color
                                        : AppColors.divider,
                                    width: isActive ? 2 : 1.5,
                                  ),
                                ),
                                child: Icon(
                                  isDone
                                      ? Icons.check
                                      : step['icon'] as IconData,
                                  size: 16,
                                  color: isDone
                                      ? Colors.white
                                      : isActive
                                          ? color
                                          : AppColors.textLight,
                                ),
                              ),
                              if (!isLast)
                                AnimatedContainer(
                                  duration: const Duration(milliseconds: 400),
                                  width: 2,
                                  height: 52,
                                  decoration: BoxDecoration(
                                    color: isDone
                                        ? color.withOpacity(0.4)
                                        : AppColors.divider,
                                    borderRadius: BorderRadius.circular(2),
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(width: 14),
                          // Step content
                          Expanded(
                            child: Padding(
                              padding: EdgeInsets.only(
                                  bottom: isLast ? 0 : 20, top: 4),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          step['title'] as String,
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: isDone || isActive
                                                ? FontWeight.w700
                                                : FontWeight.w500,
                                            color: isDone
                                                ? color
                                                : isActive
                                                    ? AppColors.textPrimary
                                                    : AppColors.textLight,
                                          ),
                                        ),
                                      ),
                                      if (isActive)
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 8, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: color.withOpacity(0.12),
                                            borderRadius:
                                                BorderRadius.circular(20),
                                          ),
                                          child: Text('In Progress',
                                              style: TextStyle(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.w600,
                                                  color: color)),
                                        ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  Text(step['subtitle'] as String,
                                      style: const TextStyle(
                                          fontSize: 12,
                                          color: AppColors.textSecondary)),
                                  const SizedBox(height: 2),
                                  Text(step['time'] as String,
                                      style: const TextStyle(
                                          fontSize: 11,
                                          color: AppColors.textLight)),

                                  // Confirm delivery button on that step
                                  if (isActive &&
                                      status ==
                                          TrackingStatus.deliveryConfirmation)
                                    Padding(
                                      padding: const EdgeInsets.only(top: 10),
                                      child: ElevatedButton(
                                        onPressed: () {
                                          setState(() => _currentStatus =
                                              TrackingStatus.fundsReleased);
                                        },
                                        style: ElevatedButton.styleFrom(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 16, vertical: 10),
                                          shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(10)),
                                          textStyle: const TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w600),
                                        ),
                                        child: const Text('Confirm Delivery'),
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      );
                    }),

                    const SizedBox(height: 24),

                    // Tracking number
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.divider),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.local_shipping_outlined,
                              size: 20, color: AppColors.accent),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text('Tracking Number',
                                    style: TextStyle(
                                        fontSize: 11,
                                        color: AppColors.textSecondary)),
                                Text('FDX-2024-NG-88412',
                                    style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: AppColors.textPrimary)),
                              ],
                            ),
                          ),
                          GestureDetector(
                            onTap: () {},
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text('Track',
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600)),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Action buttons
                    Row(
                      children: [
                        Expanded(
                          child: _ActionButton(
                            icon: Icons.chat_bubble_outline,
                            label: 'Contact Seller',
                            onTap: () {},
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _ActionButton(
                            icon: Icons.gavel_outlined,
                            label: 'Raise Dispute',
                            color: const Color(0xFFE53935),
                            onTap: () => _showDisputeBottomSheet(context),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 80),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showDisputeBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        padding: EdgeInsets.fromLTRB(
            20, 20, 20, MediaQuery.of(context).viewInsets.bottom + 32),
        decoration: const BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                      color: AppColors.divider,
                      borderRadius: BorderRadius.circular(2))),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE53935).withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.gavel_outlined,
                      color: Color(0xFFE53935), size: 18),
                ),
                const SizedBox(width: 12),
                const Text('Raise a Dispute',
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary)),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'Describe the issue with your order. BetaSale admin will review and mediate.',
              style:
                  TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
            const SizedBox(height: 20),
            const Text('Reason',
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary)),
            const SizedBox(height: 8),
            ...[
              'Item not as described',
              'Item not received',
              'Item is damaged',
              'Wrong item sent',
              'Other'
            ]
                .map((r) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: GestureDetector(
                        onTap: () {},
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 14, vertical: 12),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppColors.divider),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.radio_button_unchecked,
                                  size: 18, color: AppColors.textLight),
                              const SizedBox(width: 10),
                              Text(r,
                                  style: const TextStyle(
                                      fontSize: 13,
                                      color: AppColors.textPrimary)),
                            ],
                          ),
                        ),
                      ),
                    ))
                .toList(),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE53935),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text('Submit Dispute',
                    style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final Color? color;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final c = color ?? AppColors.primary;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 13),
        decoration: BoxDecoration(
          color: c.withOpacity(0.06),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: c.withOpacity(0.25)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 18, color: c),
            const SizedBox(width: 8),
            Text(label,
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: c)),
          ],
        ),
      ),
    );
  }
}
