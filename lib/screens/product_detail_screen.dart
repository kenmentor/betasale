import 'package:flutter/material.dart';
import '../models/product.dart';
import '../models/cart_manager.dart';
import '../theme/app_theme.dart';
import 'cart_screen.dart';

class ProductDetailScreen extends StatefulWidget {
  final Product product;
  const ProductDetailScreen({super.key, required this.product});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  bool _isWishlisted = false;
  String _selectedSize = 'M';
  int _quantity = 1;

  final List<String> _sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  @override
  void initState() {
    super.initState();
    _isWishlisted = widget.product.isWishlisted;
  }

  void _addToCart() {
    final product = widget.product;
    CartManager().addItem(CartItem(
      id: product.id,
      name: product.name,
      brand: product.category.toUpperCase(),
      price: product.price,
      rawPrice: double.tryParse(
              product.price.replaceAll('₦', '').replaceAll(',', '')) ??
          0,
      image: product.image,
      size: _selectedSize,
      quantity: _quantity,
    ));

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${product.name} added to cart!'),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        action: SnackBarAction(
          label: 'View Bag',
          textColor: AppColors.accent,
          onPressed: () => Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const CartScreen()),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final product = widget.product;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverAppBar(
                expandedHeight: 360,
                pinned: true,
                backgroundColor: AppColors.background,
                leading: Padding(
                  padding: const EdgeInsets.all(8),
                  child: GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.9),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.arrow_back_ios_new,
                          size: 16, color: AppColors.textPrimary),
                    ),
                  ),
                ),
                actions: [
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: GestureDetector(
                      onTap: () =>
                          setState(() => _isWishlisted = !_isWishlisted),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.9),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Icon(
                          _isWishlisted
                              ? Icons.favorite
                              : Icons.favorite_border,
                          size: 20,
                          color: _isWishlisted
                              ? AppColors.wishlistRed
                              : AppColors.textPrimary,
                        ),
                      ),
                    ),
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(
                    color: AppColors.cardBg,
                    child: Image.asset(
                      product.image,
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => Container(
                        color: AppColors.surface,
                        child: const Icon(Icons.image_outlined,
                            color: AppColors.textLight, size: 80),
                      ),
                    ),
                  ),
                ),
              ),

              SliverToBoxAdapter(
                child: Container(
                  decoration: const BoxDecoration(
                    color: AppColors.background,
                    borderRadius:
                        BorderRadius.vertical(top: Radius.circular(28)),
                  ),
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 120),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppColors.accent.withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    product.category,
                                    style: const TextStyle(
                                      fontSize: 11,
                                      color: AppColors.accent,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  product.name,
                                  style: const TextStyle(
                                    fontSize: 22,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.textPrimary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            product.price,
                            style: const TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      Row(
                        children: [
                          ...List.generate(
                            5,
                            (i) => Icon(
                              i < product.rating.floor()
                                  ? Icons.star
                                  : Icons.star_border,
                              size: 16,
                              color: const Color(0xFFFFC107),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            '${product.rating} (${product.reviews} reviews)',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      const Text('Select Size',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          )),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 10,
                        children: _sizes.map((size) {
                          final isSelected = _selectedSize == size;
                          return GestureDetector(
                            onTap: () =>
                                setState(() => _selectedSize = size),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              width: 46,
                              height: 46,
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? AppColors.primary
                                    : AppColors.surface,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected
                                      ? AppColors.primary
                                      : AppColors.divider,
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  size,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: isSelected
                                        ? Colors.white
                                        : AppColors.textSecondary,
                                  ),
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),

                      Row(
                        children: [
                          const Text('Quantity',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary,
                              )),
                          const Spacer(),
                          _QuantityButton(
                            icon: Icons.remove,
                            onTap: () {
                              if (_quantity > 1) setState(() => _quantity--);
                            },
                          ),
                          SizedBox(
                            width: 40,
                            child: Center(
                              child: Text('$_quantity',
                                  style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textPrimary)),
                            ),
                          ),
                          _QuantityButton(
                            icon: Icons.add,
                            onTap: () => setState(() => _quantity++),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      const Divider(color: AppColors.divider, thickness: 1),
                      const SizedBox(height: 20),

                      const Text('Description',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textPrimary,
                          )),
                      const SizedBox(height: 10),
                      Text(
                        product.description,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppColors.textSecondary,
                          height: 1.6,
                        ),
                      ),
                      const SizedBox(height: 24),

                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: AppColors.divider),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('How BetaSale Escrow Works',
                                style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.textPrimary)),
                            const SizedBox(height: 12),
                            _EscrowStep(
                              number: '1',
                              title: 'Funds Held',
                              subtitle:
                                  'Your payment is secured in our vault until you receive the item.',
                            ),
                            const SizedBox(height: 10),
                            _EscrowStep(
                              number: '2',
                              title: 'Item Shipped',
                              subtitle:
                                  'The seller ships the item with verified tracking.',
                            ),
                            const SizedBox(height: 10),
                            _EscrowStep(
                              number: '3',
                              title: 'Funds Released',
                              subtitle:
                                  'Once you confirm delivery, we release the funds to the seller.',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // ── Bottom CTA ──
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 32),
              decoration: BoxDecoration(
                color: AppColors.background,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 20,
                    offset: const Offset(0, -4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Add to cart button
                  GestureDetector(
                    onTap: _addToCart,
                    child: Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: AppColors.divider),
                      ),
                      child: const Icon(Icons.shopping_bag_outlined,
                          color: AppColors.textPrimary, size: 22),
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Buy now button
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        _addToCart();
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) => const CartScreen()),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14)),
                      ),
                      child: const Text('Buy Now',
                          style: TextStyle(
                              fontSize: 16, fontWeight: FontWeight.w600)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _QuantityButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _QuantityButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.divider),
        ),
        child: Icon(icon, size: 18, color: AppColors.textPrimary),
      ),
    );
  }
}

class _EscrowStep extends StatelessWidget {
  final String number;
  final String title;
  final String subtitle;

  const _EscrowStep({
    required this.number,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: const BoxDecoration(
            color: AppColors.accent,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(number,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w700)),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textPrimary)),
              Text(subtitle,
                  style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                      height: 1.4)),
            ],
          ),
        ),
      ],
    );
  }
}