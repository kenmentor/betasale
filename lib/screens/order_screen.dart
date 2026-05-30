import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'order_tracking_screen.dart';

class _Order {
  final String id;
  final String item;
  final String seller;
  final String price;
  final String date;
  final String status;
  final Color statusColor;
  final String image;
  final String escrowStatus;

  const _Order({
    required this.id,
    required this.item,
    required this.seller,
    required this.price,
    required this.date,
    required this.status,
    required this.statusColor,
    required this.image,
    required this.escrowStatus,
  });
}

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  static const _active = [
    _Order(
      id: '#BS-4822',
      item: 'Nike Air Max 270 React',
      seller: 'SneakerVault',
      price: '₦185,000',
      date: 'May 28, 2026',
      status: 'In Transit',
      statusColor: Color(0xFF2196F3),
      image: 'assets/images/nike_airmax.jpg',
      escrowStatus: 'Funds Held',
    ),
    _Order(
      id: '#BS-4821',
      item: 'Architectural Tote',
      seller: 'LuxeLeather Co.',
      price: '₦134,000',
      date: 'May 27, 2026',
      status: 'Seller Preparing',
      statusColor: Color(0xFFFF9800),
      image: 'assets/images/bag.jpg',
      escrowStatus: 'Funds Held',
    ),
  ];

  static const _pending = [
    _Order(
      id: '#BS-4820',
      item: 'Sculptural Heel',
      seller: 'EstateFootwear',
      price: '₦88,500',
      date: 'May 26, 2026',
      status: 'Awaiting Payment',
      statusColor: Color(0xFFFF9800),
      image: 'assets/images/sneakers.jpg',
      escrowStatus: 'Not Started',
    ),
    _Order(
      id: '#BS-4819',
      item: 'Oversized Hoodie',
      seller: 'UrbanThreads',
      price: '₦49,999',
      date: 'May 25, 2026',
      status: 'Pending Seller',
      statusColor: Color(0xFF9C27B0),
      image: 'assets/images/hoodie.jpg',
      escrowStatus: 'Funds Held',
    ),
  ];

  static const _history = [
    _Order(
      id: '#BS-4818',
      item: 'Luxury Watch',
      seller: 'TimeVault NG',
      price: '₦320,000',
      date: 'May 15, 2026',
      status: 'Delivered',
      statusColor: Color(0xFF4CAF50),
      image: 'assets/images/watch.jpg',
      escrowStatus: 'Funds Released',
    ),
    _Order(
      id: '#BS-4815',
      item: 'Minimal Sneakers',
      seller: 'CleanKicks',
      price: '₦69,999',
      date: 'May 10, 2026',
      status: 'Delivered',
      statusColor: Color(0xFF4CAF50),
      image: 'assets/images/sneakers.jpg',
      escrowStatus: 'Funds Released',
    ),
    _Order(
      id: '#BS-4810',
      item: 'Minimal T-Shirt',
      seller: 'UrbanThreads',
      price: '₦24,999',
      date: 'May 3, 2026',
      status: 'Disputed',
      statusColor: Color(0xFFE53935),
      image: 'assets/images/tshirt.jpg',
      escrowStatus: 'Under Review',
    ),
    _Order(
      id: '#BS-4802',
      item: 'Tote Bag',
      seller: 'BagHaus',
      price: '₦35,000',
      date: 'Apr 28, 2026',
      status: 'Delivered',
      statusColor: Color(0xFF4CAF50),
      image: 'assets/images/bag.jpg',
      escrowStatus: 'Funds Released',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Row(
                children: [
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('My Orders',
                            style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textPrimary)),
                        SizedBox(height: 2),
                        Text('Track & manage your purchases',
                            style: TextStyle(
                                fontSize: 13,
                                color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                  // Escrow summary chip
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF4CAF50).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                          color: const Color(0xFF4CAF50).withOpacity(0.3)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.verified_user,
                            size: 13, color: Color(0xFF4CAF50)),
                        SizedBox(width: 4),
                        Text('Escrow Protected',
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

            const SizedBox(height: 16),

            // Stats row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _StatChip(
                      label: 'Active',
                      count: _active.length,
                      color: const Color(0xFF2196F3)),
                  const SizedBox(width: 10),
                  _StatChip(
                      label: 'Pending',
                      count: _pending.length,
                      color: const Color(0xFFFF9800)),
                  const SizedBox(width: 10),
                  _StatChip(
                      label: 'Completed',
                      count: _history
                          .where((o) => o.status == 'Delivered')
                          .length,
                      color: const Color(0xFF4CAF50)),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Tab bar
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.divider),
              ),
              child: TabBar(
                controller: _tabController,
                indicator: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(10),
                ),
                indicatorSize: TabBarIndicatorSize.tab,
                dividerColor: Colors.transparent,
                labelColor: Colors.white,
                unselectedLabelColor: AppColors.textSecondary,
                labelStyle: const TextStyle(
                    fontSize: 13, fontWeight: FontWeight.w600),
                unselectedLabelStyle: const TextStyle(
                    fontSize: 13, fontWeight: FontWeight.w400),
                tabs: [
                  Tab(text: 'Active (${_active.length})'),
                  Tab(text: 'Pending (${_pending.length})'),
                  const Tab(text: 'History'),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // Tab content
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  _OrderList(orders: _active, emptyMsg: 'No active orders'),
                  _OrderList(
                      orders: _pending,
                      emptyMsg: 'No pending orders',
                      isPending: true),
                  _OrderList(
                      orders: _history,
                      emptyMsg: 'No order history',
                      isHistory: true),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Order list ──
class _OrderList extends StatelessWidget {
  final List<_Order> orders;
  final String emptyMsg;
  final bool isPending;
  final bool isHistory;

  const _OrderList({
    required this.orders,
    required this.emptyMsg,
    this.isPending = false,
    this.isHistory = false,
  });

  @override
  Widget build(BuildContext context) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: const BoxDecoration(
                  color: AppColors.surface, shape: BoxShape.circle),
              child: const Icon(Icons.receipt_long_outlined,
                  size: 32, color: AppColors.textLight),
            ),
            const SizedBox(height: 12),
            Text(emptyMsg,
                style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary)),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(20, 4, 20, 100),
      itemCount: orders.length,
      separatorBuilder: (_, __) => const SizedBox(height: 12),
      itemBuilder: (context, index) => _OrderCard(
        order: orders[index],
        isPending: isPending,
        isHistory: isHistory,
      ),
    );
  }
}

// ── Order card ──
class _OrderCard extends StatelessWidget {
  final _Order order;
  final bool isPending;
  final bool isHistory;

  const _OrderCard({
    required this.order,
    this.isPending = false,
    this.isHistory = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => OrderTrackingScreen(orderId: order.id),
        ),
      ),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.cardBg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.divider),
        ),
        child: Column(
          children: [
            Row(
              children: [
                // Product image
                ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: SizedBox(
                    width: 62,
                    height: 68,
                    child: Image.asset(
                      order.image,
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: AppColors.surface,
                        child: const Icon(Icons.image_outlined,
                            color: AppColors.textLight, size: 24),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Order ID + status
                      Row(
                        children: [
                          Text(order.id,
                              style: const TextStyle(
                                  fontSize: 11,
                                  color: AppColors.textSecondary,
                                  fontWeight: FontWeight.w500)),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: order.statusColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(order.status,
                                style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    color: order.statusColor)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(order.item,
                          style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textPrimary),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 2),
                      Text('Seller: ${order.seller}',
                          style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Text(order.price,
                              style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.textPrimary)),
                          const Spacer(),
                          Text(order.date,
                              style: const TextStyle(
                                  fontSize: 11,
                                  color: AppColors.textLight)),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 12),
            const Divider(color: AppColors.divider, height: 1),
            const SizedBox(height: 10),

            // Bottom row: escrow status + action buttons
            Row(
              children: [
                // Escrow badge
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _escrowColor(order.escrowStatus).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.verified_user,
                          size: 11,
                          color: _escrowColor(order.escrowStatus)),
                      const SizedBox(width: 4),
                      Text(order.escrowStatus,
                          style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: _escrowColor(order.escrowStatus))),
                    ],
                  ),
                ),
                const Spacer(),
                // Action buttons
                if (!isHistory)
                  _SmallBtn(
                    label: 'Track Order',
                    icon: Icons.track_changes,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) =>
                            OrderTrackingScreen(orderId: order.id),
                      ),
                    ),
                  ),
                if (isHistory) ...[
                  _SmallBtn(
                    label: 'Reorder',
                    icon: Icons.refresh,
                    onTap: () {},
                  ),
                  const SizedBox(width: 8),
                  _SmallBtn(
                    label: 'Review',
                    icon: Icons.star_border,
                    onTap: () {},
                    outlined: true,
                  ),
                ],
                if (isPending) ...[
                  const SizedBox(width: 8),
                  _SmallBtn(
                    label: 'Cancel',
                    icon: Icons.close,
                    color: const Color(0xFFE53935),
                    onTap: () {},
                    outlined: true,
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _escrowColor(String status) {
    switch (status) {
      case 'Funds Released':
        return const Color(0xFF4CAF50);
      case 'Funds Held':
        return const Color(0xFF2196F3);
      case 'Under Review':
        return const Color(0xFFE53935);
      default:
        return AppColors.textLight;
    }
  }
}

class _SmallBtn extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool outlined;
  final Color? color;

  const _SmallBtn({
    required this.label,
    required this.icon,
    required this.onTap,
    this.outlined = false,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final c = color ?? AppColors.primary;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: outlined ? Colors.transparent : c,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
              color: outlined ? c : Colors.transparent),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon,
                size: 13,
                color: outlined ? c : Colors.white),
            const SizedBox(width: 4),
            Text(label,
                style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: outlined ? c : Colors.white)),
          ],
        ),
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  final String label;
  final int count;
  final Color color;

  const _StatChip(
      {required this.label, required this.count, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('$count',
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: color)),
          const SizedBox(width: 5),
          Text(label,
              style: const TextStyle(
                  fontSize: 12, color: AppColors.textSecondary)),
        ],
      ),
    );
  }
}
