import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'cart_screen.dart';
import 'payment_confirmation_screen.dart';

class CheckoutScreen extends StatefulWidget {
  final double total;
  final List<CartItem> items;

  const CheckoutScreen({
    super.key,
    required this.total,
    required this.items,
  });

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  int _paymentMethod = 0; // 0=Card, 1=Bank Transfer, 2=USSD
  bool _isProcessing = false;

  String _fmt(double v) =>
      '₦${v.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+$)'), (m) => '${m[1]},')}';

  double get _escrowFee => widget.total * 0.015 / 1.015;
  double get _shipping => 2500;
  double get _subtotal => widget.total - _escrowFee - _shipping;

  void _placeOrder() async {
    setState(() => _isProcessing = true);
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      setState(() => _isProcessing = false);
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => PaymentConfirmationScreen(
            total: widget.total,
            orderId: '#BS-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
          ),
        ),
      );
    }
  }

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
                  const Text('Checkout',
                      style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary)),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),

                    // Escrow protected banner
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            const Color(0xFF4CAF50).withOpacity(0.12),
                            const Color(0xFF4CAF50).withOpacity(0.04),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                            color: const Color(0xFF4CAF50).withOpacity(0.35)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: const Color(0xFF4CAF50).withOpacity(0.15),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.verified_user,
                                color: Color(0xFF4CAF50), size: 18),
                          ),
                          const SizedBox(width: 12),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Escrow Protected',
                                    style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFF4CAF50))),
                                Text(
                                  'Your payment will be held safely in escrow until delivery is confirmed.',
                                  style: TextStyle(
                                      fontSize: 11,
                                      color: AppColors.textSecondary),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Order summary
                    _SectionTitle('Order Summary'),
                    const SizedBox(height: 12),
                    ...widget.items.map((item) => Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: SizedBox(
                                  width: 52,
                                  height: 56,
                                  child: Image.asset(
                                    item.image,
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) => Container(
                                      color: AppColors.surface,
                                      child: const Icon(Icons.image_outlined,
                                          size: 20,
                                          color: AppColors.textLight),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(item.name,
                                        style: const TextStyle(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w600,
                                            color: AppColors.textPrimary)),
                                    Text(
                                        'Size: ${item.size}  ·  Qty: ${item.quantity}',
                                        style: const TextStyle(
                                            fontSize: 11,
                                            color: AppColors.textSecondary)),
                                  ],
                                ),
                              ),
                              Text(item.price,
                                  style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textPrimary)),
                            ],
                          ),
                        )),

                    const Divider(color: AppColors.divider),
                    _CheckoutSummaryRow('Subtotal', _fmt(_subtotal)),
                    const SizedBox(height: 6),
                    _CheckoutSummaryRow('Escrow Fee (1.5%)', _fmt(_escrowFee)),
                    const SizedBox(height: 6),
                    _CheckoutSummaryRow(
                        'Shipping (Estimated)', _fmt(_shipping)),
                    const Divider(color: AppColors.divider),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total',
                            style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textPrimary)),
                        Text(_fmt(widget.total),
                            style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textPrimary)),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Shipping address
                    _SectionTitle('Shipping Address'),
                    const SizedBox(height: 12),
                    _AddressCard(),

                    const SizedBox(height: 24),

                    // Payment method
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _SectionTitle('Secure Payment'),
                        Row(
                          children: const [
                            Icon(Icons.lock, size: 12, color: AppColors.textLight),
                            SizedBox(width: 4),
                            Text('Powered by Paystack',
                                style: TextStyle(
                                    fontSize: 11, color: AppColors.textLight)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    _PaymentOption(
                      index: 0,
                      selected: _paymentMethod,
                      icon: Icons.credit_card,
                      label: 'Pay with Card',
                      onTap: () => setState(() => _paymentMethod = 0),
                    ),
                    const SizedBox(height: 10),
                    _PaymentOption(
                      index: 1,
                      selected: _paymentMethod,
                      icon: Icons.account_balance,
                      label: 'Bank Transfer',
                      onTap: () => setState(() => _paymentMethod = 1),
                    ),
                    const SizedBox(height: 10),
                    _PaymentOption(
                      index: 2,
                      selected: _paymentMethod,
                      icon: Icons.dialpad,
                      label: 'USSD',
                      onTap: () => setState(() => _paymentMethod = 2),
                    ),

                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),

            // Pay Now CTA
            Container(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
              decoration: BoxDecoration(
                color: AppColors.background,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 16,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _isProcessing ? null : _placeOrder,
                      icon: _isProcessing
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(
                                  color: Colors.white, strokeWidth: 2),
                            )
                          : const Icon(Icons.lock_outline,
                              size: 18, color: Colors.white),
                      label: Text(
                        _isProcessing
                            ? 'Processing...'
                            : 'Pay Now ${_fmt(widget.total)}',
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w600),
                      ),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '🔒 End-to-end encrypted  ·  Escrow protected',
                    style:
                        TextStyle(fontSize: 11, color: AppColors.textLight),
                    textAlign: TextAlign.center,
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

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(text,
        style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary));
  }
}

class _CheckoutSummaryRow extends StatelessWidget {
  final String label;
  final String value;
  const _CheckoutSummaryRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label,
              style: const TextStyle(
                  fontSize: 13, color: AppColors.textSecondary)),
          Text(value,
              style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary)),
        ],
      ),
    );
  }
}

class _AddressCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.location_on_outlined,
                color: AppColors.primary, size: 18),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('John Doe',
                    style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary)),
                Text(
                  '14b Admiralty Way, Lekki Phase 1\nLagos, Nigeria  ·  +234 801 234 5678',
                  style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                      height: 1.5),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: () {},
            child: const Text('Edit',
                style: TextStyle(
                    fontSize: 12,
                    color: AppColors.accent,
                    fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }
}

class _PaymentOption extends StatelessWidget {
  final int index;
  final int selected;
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _PaymentOption({
    required this.index,
    required this.selected,
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = index == selected;
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withOpacity(0.04)
              : AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.divider,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          children: [
            Icon(icon,
                size: 20,
                color: isSelected
                    ? AppColors.primary
                    : AppColors.textSecondary),
            const SizedBox(width: 12),
            Expanded(
              child: Text(label,
                  style: TextStyle(
                      fontSize: 14,
                      fontWeight: isSelected
                          ? FontWeight.w600
                          : FontWeight.w400,
                      color: isSelected
                          ? AppColors.primary
                          : AppColors.textPrimary)),
            ),
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? AppColors.primary : AppColors.textLight,
                  width: 2,
                ),
                color: isSelected ? AppColors.primary : Colors.transparent,
              ),
              child: isSelected
                  ? const Icon(Icons.check, size: 12, color: Colors.white)
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}