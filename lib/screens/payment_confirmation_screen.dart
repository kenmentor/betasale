import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'order_tracking_screen.dart';

class PaymentConfirmationScreen extends StatefulWidget {
  final double total;
  final String orderId;

  const PaymentConfirmationScreen({
    super.key,
    required this.total,
    required this.orderId,
  });

  @override
  State<PaymentConfirmationScreen> createState() =>
      _PaymentConfirmationScreenState();
}

class _PaymentConfirmationScreenState extends State<PaymentConfirmationScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnim;
  late Animation<double> _fadeAnim;

  String _fmt(double v) =>
      '₦${v.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+$)'), (m) => '${m[1]},')}';

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 700));
    _scaleAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: _controller, curve: Curves.elasticOut));
    _fadeAnim = Tween<double>(begin: 0.0, end: 1.0).animate(
        CurvedAnimation(parent: _controller, curve: const Interval(0.4, 1.0)));
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const SizedBox(height: 48),

              // Animated checkmark
              ScaleTransition(
                scale: _scaleAnim,
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: const Color(0xFF4CAF50).withOpacity(0.12),
                    border: Border.all(
                        color: const Color(0xFF4CAF50).withOpacity(0.4),
                        width: 2),
                  ),
                  child: const Icon(Icons.check_circle,
                      color: Color(0xFF4CAF50), size: 56),
                ),
              ),

              const SizedBox(height: 24),

              FadeTransition(
                opacity: _fadeAnim,
                child: Column(
                  children: [
                    const Text(
                      'Payment Successful!',
                      style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textPrimary),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Your funds are now secured in escrow.\nWe\'ll notify you when the seller ships.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                          fontSize: 14,
                          color: AppColors.textSecondary,
                          height: 1.6),
                    ),
                    const SizedBox(height: 32),

                    // Receipt card
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppColors.cardBg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.divider),
                      ),
                      child: Column(
                        children: [
                          _ReceiptRow('Order ID', widget.orderId),
                          const Divider(color: AppColors.divider, height: 20),
                          _ReceiptRow('Amount Paid', _fmt(widget.total)),
                          const SizedBox(height: 6),
                          _ReceiptRow(
                            'Escrow Status',
                            'Funds Held Safely',
                            valueColor: const Color(0xFF4CAF50),
                          ),
                          const SizedBox(height: 6),
                          _ReceiptRow('Date', _formatDate()),
                          const SizedBox(height: 6),
                          _ReceiptRow('Payment Method', 'Card •••• 4521'),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Escrow steps
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.divider),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'What happens next?',
                            style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary),
                          ),
                          const SizedBox(height: 12),
                          _NextStep(
                              icon: Icons.lock,
                              color: const Color(0xFF4CAF50),
                              title: 'Funds Secured',
                              subtitle: 'Your payment is held in escrow',
                              isDone: true),
                          _NextStep(
                              icon: Icons.local_shipping_outlined,
                              color: AppColors.accent,
                              title: 'Seller Ships',
                              subtitle: 'Seller prepares & ships your item',
                              isDone: false),
                          _NextStep(
                              icon: Icons.inventory_2_outlined,
                              color: const Color(0xFF2196F3),
                              title: 'You Confirm',
                              subtitle: 'Confirm receipt of your item',
                              isDone: false),
                          _NextStep(
                              icon: Icons.payments_outlined,
                              color: const Color(0xFF9C27B0),
                              title: 'Funds Released',
                              subtitle: 'Seller receives payment',
                              isDone: false,
                              isLast: true),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              // CTAs
              FadeTransition(
                opacity: _fadeAnim,
                child: Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                            builder: (_) =>
                                OrderTrackingScreen(orderId: widget.orderId),
                          ),
                        ),
                        icon: const Icon(Icons.track_changes,
                            size: 18, color: Colors.white),
                        label: const Text(
                          'Track My Order',
                          style: TextStyle(
                              fontSize: 15, fontWeight: FontWeight.w600),
                        ),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton(
                        onPressed: () => Navigator.pushNamedAndRemoveUntil(
                            context, '/home', (_) => false),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          side: const BorderSide(color: AppColors.divider),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Text(
                          'Continue Shopping',
                          style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimary),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate() {
    final now = DateTime.now();
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${now.day} ${months[now.month - 1]} ${now.year}';
  }
}

class _ReceiptRow extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;

  const _ReceiptRow(this.label, this.value, {this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 13, color: AppColors.textSecondary)),
        Text(value,
            style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: valueColor ?? AppColors.textPrimary)),
      ],
    );
  }
}

class _NextStep extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final bool isDone;
  final bool isLast;

  const _NextStep({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    required this.isDone,
    this.isLast = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDone ? color : color.withOpacity(0.1),
                border: Border.all(
                    color: isDone ? color : color.withOpacity(0.3),
                    width: 1.5),
              ),
              child: Icon(isDone ? Icons.check : icon,
                  size: 14, color: isDone ? Colors.white : color),
            ),
            if (!isLast)
              Container(width: 1.5, height: 28, color: AppColors.divider),
          ],
        ),
        const SizedBox(width: 12),
        Padding(
          padding: const EdgeInsets.only(top: 4, bottom: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: isDone ? color : AppColors.textPrimary)),
              Text(subtitle,
                  style: const TextStyle(
                      fontSize: 11, color: AppColors.textSecondary)),
            ],
          ),
        ),
      ],
    );
  }
}