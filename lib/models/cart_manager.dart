import '../screens/cart_screen.dart';

class CartManager {
  static final CartManager _instance = CartManager._internal();
  factory CartManager() => _instance;
  CartManager._internal();

  final List<CartItem> items = [];

  void addItem(CartItem newItem) {
    final existing = items.where((i) => i.id == newItem.id).firstOrNull;
    if (existing != null) {
      existing.quantity += newItem.quantity;
    } else {
      items.add(newItem);
    }
  }

  void removeItem(String id) => items.removeWhere((i) => i.id == id);

  int get totalCount => items.fold(0, (sum, i) => sum + i.quantity);
}