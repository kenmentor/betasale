import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/cart_manager.dart';
import 'checkout_screen.dart';

class CartItem {
  final String id;
  final String name;
  final String brand;
  final String price;
  final double rawPrice;
  final String image;
  String size;
  int quantity;

  CartItem({
    required this.id,
    required this.name,
    required this.brand,
    required this.price,
    required this.rawPrice,
    required this.image,
    this.size = 'M',
    this.quantity = 1,
  });
}

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final _cart = CartManager();
  final _promoController = TextEditingController();
  bool _promoApplied = false;
  String _promoCode = '';

  List<CartItem> get _items => _cart.items;

  double get _subtotal =>
      _items.fold(0, (sum, item) => sum + item.rawPrice * item.quantity);
  double get _escrowFee => _subtotal * 0.015;
  double get _shipping => _items.isEmpty ? 0 : 2500;
  double get _discount => _promoApplied ? _subtotal * 0.05 : 0;
  double get _total => _subtotal + _escrowFee + _shipping - _discount;

  String _fmt(double v) =>
      '₦${v.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+$)'), (m) => '${m[1]},')}';

  @override
  void dispose() {
    _promoController.dispose();
    super.dispose();
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
                  const Text(
                    'Your Bag',
                    style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '${_items.length} item${_items.length == 1 ? '' : 's'}',
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: _items.isEmpty
                  ? _EmptyCart()
                  : SingleChildScrollView(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 20),

                          // Escrow badge
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 14, vertical: 10),
                            decoration: BoxDecoration(
                              color: const Color(0xFF4CAF50).withOpacity(0.08),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                  color:
                                      const Color(0xFF4CAF50).withOpacity(0.3)),
                            ),
                            child: Row(
                              children: const [
                                Icon(Icons.verified_user,
                                    color: Color(0xFF4CAF50), size: 18),
                                SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    'Escrow Protected — Pay safely, get what you ordered',
                                    style: TextStyle(
                                        fontSize: 12,
                                        color: Color(0xFF4CAF50),
                                        fontWeight: FontWeight.w500),
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 20),

                          // Cart items
                          ..._items.map((item) => _CartItemCard(
                                item: item,
                                onRemove: () => setState(
                                    () => _cart.removeItem(item.id)),
                                onQtyChange: (q) =>
                                    setState(() => item.quantity = q),
                              )),

                          const SizedBox(height: 20),

                          // Promo code
                          const Text(
                            'HAVE A PROMO CODE?',
                            style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textSecondary,
                                letterSpacing: 1),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _promoController,
                                  decoration: InputDecoration(
                                    hintText: 'Enter promo code',
                                    hintStyle: const TextStyle(
                                        fontSize: 13,
                                        color: AppColors.textLight),
                                    contentPadding:
                                        const EdgeInsets.symmetric(
                                            horizontal: 14, vertical: 12),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                      borderSide: const BorderSide(
                                          color: AppColors.divider),
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                      borderSide: const BorderSide(
                                          color: AppColors.divider),
                                    ),
                                    focusedBorder: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(10),
                                      borderSide: const BorderSide(
                                          color: AppColors.accent, width: 1.5),
                                    ),
                                    filled: true,
                                    fillColor: AppColors.surface,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              GestureDetector(
                                onTap: () {
                                  setState(() {
                                    _promoCode = _promoController.text;
                                    _promoApplied = _promoCode.isNotEmpty;
                                  });
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 18, vertical: 13),
                                  decoration: BoxDecoration(
                                    color: AppColors.primary,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: const Text(
                                    'Apply',
                                    style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          if (_promoApplied) ...[
                            const SizedBox(height: 8),
                            Row(
                              children: const [
                                Icon(Icons.check_circle,
                                    color: Color(0xFF4CAF50), size: 14),
                                SizedBox(width: 6),
                                Text(
                                  'Promo applied! 5% off your order',
                                  style: TextStyle(
                                      fontSize: 12,
                                      color: Color(0xFF4CAF50),
                                      fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                          ],

                          const SizedBox(height: 24),

                          // Order summary
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppColors.cardBg,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: AppColors.divider),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'ORDER SUMMARY',
                                  style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textSecondary,
                                      letterSpacing: 1),
                                ),
                                const SizedBox(height: 14),
                                _SummaryRow('Subtotal', _fmt(_subtotal)),
                                const SizedBox(height: 8),
                                _SummaryRow('Escrow Fee (1.5%)',
                                    _fmt(_escrowFee),
                                    subtitle: 'Buyer protection'),
                                const SizedBox(height: 8),
                                _SummaryRow(
                                    'Shipping (Estimated)', _fmt(_shipping)),
                                if (_promoApplied) ...[
                                  const SizedBox(height: 8),
                                  _SummaryRow('Promo Discount',
                                      '-${_fmt(_discount)}',
                                      isDiscount: true),
                                ],
                                const SizedBox(height: 12),
                                const Divider(
                                    color: AppColors.divider, thickness: 1),
                                const SizedBox(height: 12),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('TOTAL',
                                        style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.textPrimary)),
                                    Text(_fmt(_total),
                                        style: const TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.textPrimary)),
                                  ],
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(height: 100),
                        ],
                      ),
                    ),
            ),

            // Bottom CTA
            if (_items.isNotEmpty)
              Container(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
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
                        onPressed: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => CheckoutScreen(
                              total: _total,
                              items: List.from(_items),
                            ),
                          ),
                        ),
                        icon: const Icon(Icons.lock_outline,
                            size: 18, color: Colors.white),
                        label: Text(
                            'Proceed to Secure Checkout — ${_fmt(_total)}',
                            style: const TextStyle(
                                fontSize: 15, fontWeight: FontWeight.w600)),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.verified_user_outlined,
                            size: 13, color: AppColors.textLight),
                        SizedBox(width: 4),
                        Text(
                          'Payment held securely in escrow until delivery',
                          style: TextStyle(
                              fontSize: 11, color: AppColors.textLight),
                        ),
                      ],
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

// ── Empty Cart ──
class _EmptyCart extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 90,
            height: 90,
            decoration: BoxDecoration(
              color: AppColors.surface,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.divider),
            ),
            child: const Icon(Icons.shopping_bag_outlined,
                size: 40, color: AppColors.textLight),
          ),
          const SizedBox(height: 16),
          const Text('Your bag is empty',
              style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary)),
          const SizedBox(height: 6),
          const Text('Add items from the store to get started',
              style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          const SizedBox(height: 24),
          GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text('Continue Shopping',
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600)),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Cart Item Card ──
class _CartItemCard extends StatelessWidget {
  final CartItem item;
  final VoidCallback onRemove;
  final ValueChanged<int> onQtyChange;

  const _CartItemCard({
    required this.item,
    required this.onRemove,
    required this.onQtyChange,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.divider),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(
              width: 80,
              height: 90,
              child: Image.asset(
                item.image,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(
                  color: AppColors.surface,
                  child: const Icon(Icons.image_outlined,
                      color: AppColors.textLight, size: 32),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.brand,
                    style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: AppColors.accent,
                        letterSpacing: 0.8)),
                const SizedBox(height: 2),
                Text(item.name,
                    style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary)),
                const SizedBox(height: 4),
                Text('Size: ${item.size}',
                    style: const TextStyle(
                        fontSize: 12, color: AppColors.textSecondary)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _QtyBtn(
                      icon: Icons.remove,
                      onTap: () {
                        if (item.quantity > 1) onQtyChange(item.quantity - 1);
                      },
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      child: Text('${item.quantity}',
                          style: const TextStyle(
                              fontSize: 14, fontWeight: FontWeight.w700)),
                    ),
                    _QtyBtn(
                      icon: Icons.add,
                      onTap: () => onQtyChange(item.quantity + 1),
                    ),
                    const Spacer(),
                    Text(item.price,
                        style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary)),
                  ],
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: onRemove,
            child: Padding(
              padding: const EdgeInsets.only(left: 8),
              child: const Icon(Icons.close,
                  size: 18, color: AppColors.textLight),
            ),
          ),
        ],
      ),
    );
  }
}

class _QtyBtn extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _QtyBtn({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 28,
        height: 28,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppColors.divider),
        ),
        child: Icon(icon, size: 14, color: AppColors.textPrimary),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final String? subtitle;
  final bool isDiscount;

  const _SummaryRow(this.label, this.value,
      {this.subtitle, this.isDiscount = false});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label,
                  style: const TextStyle(
                      fontSize: 13, color: AppColors.textSecondary)),
              if (subtitle != null)
                Text(subtitle!,
                    style: const TextStyle(
                        fontSize: 10, color: AppColors.textLight)),
            ],
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: isDiscount
                ? const Color(0xFF4CAF50)
                : AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}