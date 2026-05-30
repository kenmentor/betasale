class Product {
  final String id;
  final String name;
  final String price;
  final String image;
  final String category;
  final String description;
  final double rating;
  final int reviews;
  bool isWishlisted;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.image,
    required this.category,
    required this.description,
    this.rating = 4.5,
    this.reviews = 128,
    this.isWishlisted = false,
  });
}

class AppData {
  static List<Product> products = [
    Product(
      id: '1',
      name: 'Oversized Hoodie',
      price: '₦49,999',
      image: 'assets/images/hoodie.jpg',
      category: 'Men',
      description:
          'Premium oversized hoodie crafted from 100% organic cotton. Features a relaxed fit, kangaroo pocket, and ribbed cuffs for ultimate comfort and style.',
      rating: 4.8,
      reviews: 214,
    ),
    Product(
      id: '2',
      name: 'Minimal Sneakers',
      price: '₦69,999',
      image: 'assets/images/sneakers.jpg',
      category: 'Shoes',
      description:
          'Clean, minimal design sneakers with premium leather upper and cushioned insole. Perfect for everyday wear with a modern aesthetic.',
      rating: 4.6,
      reviews: 189,
    ),
    Product(
      id: '3',
      name: 'Nike Air Max 270 React',
      price: '₦185,000',
      image: 'assets/images/nike_airmax.jpg',
      category: 'Shoes',
      description:
          'Brand new in box. Never worn. These premium sneakers feature advanced cushioning technology for all-day comfort. The lightweight upper provides excellent breathability, while the durable rubber outsole ensures maximum traction. Perfect for both athletic performance and casual everyday wear.',
      rating: 4.9,
      reviews: 342,
    ),
    Product(
      id: '4',
      name: 'Minimal T-Shirt',
      price: '₦24,999',
      image: 'assets/images/tshirt.jpg',
      category: 'Men',
      description:
          'Essential minimalist t-shirt made from soft pima cotton. A wardrobe staple that pairs with everything.',
      rating: 4.4,
      reviews: 97,
    ),
    Product(
      id: '5',
      name: 'Luxury Watch',
      price: '₦320,000',
      image: 'assets/images/watch.jpg',
      category: 'Accessories',
      description:
          'Elegant timepiece with sapphire crystal glass, stainless steel case and bracelet. Water resistant to 50m.',
      rating: 4.7,
      reviews: 76,
    ),
    Product(
      id: '6',
      name: 'Tote Bag',
      price: '₦35,000',
      image: 'assets/images/bag.jpg',
      category: 'Bags',
      description:
          'Spacious canvas tote bag with leather handles. Perfect for daily errands, shopping, or a casual day out.',
      rating: 4.3,
      reviews: 112,
    ),
  ];

  static List<Map<String, dynamic>> categories = [
    {'label': 'Men', 'icon': '🧑‍💼'},
    {'label': 'Women', 'icon': '👩‍💼'},
    {'label': 'Shoes', 'icon': '👟'},
    {'label': 'Bags', 'icon': '👜'},
    {'label': 'Beauty', 'icon': '💄'},
    {'label': 'Kids', 'icon': '🧸'},
  ];

  static List<Map<String, dynamic>> onboardingData = [
    {
      'image': 'assets/images/onboarding1.jpg',
      'title': 'Elevate Your Shopping Experience',
      'subtitle':
          'Discover the best products within affordable prices and get your goods instantly.',
    },
    {
      'image': 'assets/images/onboarding2.jpg',
      'title': 'Shop Smarter, Faster.',
      'subtitle':
          'Get your favorite items delivered quickly with secure payments and real-time tracking. It\'s also Escrow protected.',
    },
    {
      'image': 'assets/images/onboarding3.jpg',
      'title': 'Find Your Perfect Style',
      'subtitle':
          'Discover trending products tailored to your taste and enjoy a seamless shopping experience.',
    },
  ];
}
