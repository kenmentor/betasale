import 'package:flutter/material.dart';
import '../models/product.dart';
import '../widgets/product_card.dart';
import 'product_detail_screen.dart';

// ---------------------------------------------------------------------------
// Typed data class — eliminates the Null-is-not-Color runtime cast error
// ---------------------------------------------------------------------------
class _CategoryData {
  final String label;
  final int count;
  final String imageUrl;
  final Color backgroundColor;

  const _CategoryData({
    required this.label,
    required this.count,
    required this.imageUrl,
    required this.backgroundColor,
  });
}

class CategoriesScreen extends StatefulWidget {
  const CategoriesScreen({super.key});

  @override
  State<CategoriesScreen> createState() => _CategoriesScreenState();
}

class _CategoriesScreenState extends State<CategoriesScreen> {
  String _selectedCategory = 'All';
  final _searchController = TextEditingController();
  String _searchQuery = '';

  static const List<_CategoryData> _categories = [
    _CategoryData(
      label: 'Women',
      count: 320,
      imageUrl:
          'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80',
      backgroundColor: Color(0xFFF5EFE6),
    ),
    _CategoryData(
      label: 'Men',
      count: 245,
      imageUrl:
          'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&q=80',
      backgroundColor: Color(0xFFE8EDF2),
    ),
    _CategoryData(
      label: 'Kids',
      count: 180,
      imageUrl:
          'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=200&q=80',
      backgroundColor: Color(0xFFF0EDE8),
    ),
    _CategoryData(
      label: 'Beauty',
      count: 120,
      imageUrl:
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80',
      backgroundColor: Color(0xFFEEE8E0),
    ),
    _CategoryData(
      label: 'Home',
      count: 85,
      imageUrl:
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80',
      backgroundColor: Color(0xFFE8EBE4),
    ),
    _CategoryData(
      label: 'Shoes',
      count: 70,
      imageUrl:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
      backgroundColor: Color(0xFFF2EEE8),
    ),
  ];

  List<Product> get _filteredProducts {
    var list = AppData.products;
    if (_selectedCategory != 'All') {
      list = list.where((p) => p.category == _selectedCategory).toList();
    }
    if (_searchQuery.isNotEmpty) {
      list = list
          .where(
              (p) => p.name.toLowerCase().contains(_searchQuery.toLowerCase()))
          .toList();
    }
    return list;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: _buildAppBar(),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Divider(height: 1, color: Color(0xFFF0F0F0)),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _buildHeader(),
                _buildSearchBar(),
                const SizedBox(height: 8),
                ..._categories.map(_buildCategoryRow),
                if (_selectedCategory != 'All') _buildProductsSection(),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------------------
  // App bar
  // -------------------------------------------------------------------------
  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      scrolledUnderElevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios,
            size: 20, color: Color(0xFF1E1E1E)),
        onPressed: () => Navigator.maybePop(context),
      ),
      title: const Text(
        'BetaSale',
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: Color(0xFF1E1E1E),
          letterSpacing: -0.3,
        ),
      ),
      centerTitle: true,
      actions: [
        IconButton(
          icon:
              const Icon(Icons.search, size: 22, color: Color(0xFF1E1E1E)),
          onPressed: () {},
        ),
      ],
    );
  }

  // -------------------------------------------------------------------------
  // Header
  // -------------------------------------------------------------------------
  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Categories',
            style: TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w700,
              color: Color(0xFF1E1E1E),
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Explore our curated collections.',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }

  // -------------------------------------------------------------------------
  // Search bar
  // -------------------------------------------------------------------------
  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      child: Container(
        height: 46,
        decoration: BoxDecoration(
          color: const Color(0xFFF7F7F7),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFFF0F0F0)),
        ),
        child: TextField(
          controller: _searchController,
          onChanged: (v) => setState(() => _searchQuery = v),
          style:
              const TextStyle(fontSize: 14, color: Color(0xFF1E1E1E)),
          decoration: InputDecoration(
            hintText: 'Search products...',
            hintStyle: TextStyle(color: Colors.grey[400], fontSize: 14),
            prefixIcon:
                Icon(Icons.search, color: Colors.grey[400], size: 20),
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            contentPadding:
                const EdgeInsets.symmetric(vertical: 13),
          ),
        ),
      ),
    );
  }

  // -------------------------------------------------------------------------
  // Category row
  // -------------------------------------------------------------------------
  Widget _buildCategoryRow(_CategoryData category) {
    final isSelected = _selectedCategory == category.label;

    return GestureDetector(
      onTap: () => setState(() => _selectedCategory =
          isSelected ? 'All' : category.label),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 5),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF1E1E1E) : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected
                ? const Color(0xFF1E1E1E)
                : const Color(0xFFF0F0F0),
          ),
        ),
        child: Row(
          children: [
            // Text
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 20, vertical: 18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      category.label,
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                        color: isSelected
                            ? Colors.white
                            : const Color(0xFF1E1E1E),
                        letterSpacing: -0.2,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      '${category.count} ITEMS',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                        color: isSelected
                            ? Colors.white60
                            : Colors.grey[400],
                        letterSpacing: 0.8,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Thumbnail
            ClipRRect(
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(14),
                bottomRight: Radius.circular(14),
              ),
              child: SizedBox(
                width: 100,
                height: 80,
                child: Image.network(
                  category.imageUrl,
                  fit: BoxFit.cover,
                  color: isSelected
                      ? Colors.black.withOpacity(0.25)
                      : null,
                  colorBlendMode: BlendMode.darken,
                  errorBuilder: (_, __, ___) => Container(
                    color: category.backgroundColor,
                    child: Icon(Icons.image_outlined,
                        color: Colors.grey[400], size: 32),
                  ),
                  loadingBuilder: (_, child, progress) {
                    if (progress == null) return child;
                    return Container(
                      color: category.backgroundColor,
                      child: Center(
                        child: SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.grey[400],
                            value: progress.expectedTotalBytes != null
                                ? progress.cumulativeBytesLoaded /
                                    progress.expectedTotalBytes!
                                : null,
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // -------------------------------------------------------------------------
  // Products grid (shown when a category is selected)
  // -------------------------------------------------------------------------
  Widget _buildProductsSection() {
    final products = _filteredProducts;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _selectedCategory,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E1E1E),
                  letterSpacing: -0.3,
                ),
              ),
              Text(
                '${products.length} results',
                style: TextStyle(fontSize: 13, color: Colors.grey[500]),
              ),
            ],
          ),
        ),
        if (products.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 32),
            child: Center(
              child: Text(
                'No products found',
                style: TextStyle(color: Colors.grey[400], fontSize: 14),
              ),
            ),
          )
        else
          GridView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate:
                const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              crossAxisSpacing: 14,
              mainAxisSpacing: 14,
              childAspectRatio: 0.72,
            ),
            itemCount: products.length,
            itemBuilder: (context, index) {
              final product = products[index];
              return ProductCard(
                product: product,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) =>
                        ProductDetailScreen(product: product),
                  ),
                ),
                onWishlistToggle: () => setState(
                    () => product.isWishlisted = !product.isWishlisted),
              );
            },
          ),
      ],
    );
  }
}