import { ArrowRight, ShoppingBag } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
// Using your real react-native-reusables primitives
import { CartItemCard, CartItemType } from "@/components/CartItem"; // Ensure this matches your file path
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text"; // Corrected typography path

const INITIAL_CART_ITEMS: CartItemType[] = [
  {
    id: "1",
    title: "Baggy Jeans",
    price: 18500, // Normalized to realistic local market prices
    quantity: 1,
    size: "M",
    thumbnail: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  },
  {
    id: "2",
    title: "Sport Crewneck",
    price: 24000,
    quantity: 2,
    size: "L",
    thumbnail: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  },
];

export default function CartScreen() {
  const [cartItems, setCartItems] =
    useState<CartItemType[]>(INITIAL_CART_ITEMS);

  // --- ACTIONS ---
  const handleIncrement = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecrement = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    console.log("Routing to payment funnel...");
  };

  // --- CALCULATIONS ---
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const deliveryFee = cartItems.length > 0 ? 2500 : 0;
  const totalAmount = subtotal + deliveryFee;

  // --- EMPTY STATE LAYOUT ---
  if (cartItems.length === 0) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-6 gap-4">
        <View className="w-14 h-14 border border-dashed border-border rounded-full items-center justify-center">
          <ShoppingBag size={22} className="text-muted-foreground" />
        </View>
        <View className="items-center gap-1">
          <Text className="font-semibold text-xl tracking-tight text-foreground">
            Your cart is empty
          </Text>
          <Text className="text-muted-foreground text-sm text-center max-w-[280px]">
            Add items to your cart to see them listed here.
          </Text>
        </View>
        <Button size="sm" className="rounded-md px-5">
          <Text className="text-primary-foreground font-medium text-xs">
            Explore Marketplace
          </Text>
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Structural Header */}
      <View className="px-6 py-5 border-b border-border/40">
        <Text className="font-bold text-2xl tracking-tight text-foreground">
          Cart
        </Text>
        <Text className="text-muted-foreground text-sm mt-0.5">
          You have {cartItems.length} items ready for processing
        </Text>
      </View>

      {/* Flat Content Feed */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      />

      {/* Checkout Summary Block using Card Components */}
      <View className="p-4 bg-background border-t border-border/40">
        <Card className="border-border/60 shadow-none bg-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-semibold tracking-tight text-foreground">
              Order Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 pt-0 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground text-sm">Subtotal</Text>
              <Text className="font-medium text-sm text-foreground">
                ₦{subtotal.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground text-sm">Shipping</Text>
              <Text className="font-medium text-sm text-foreground">
                ₦{deliveryFee.toLocaleString()}
              </Text>
            </View>
            <View className="h-[1px] bg-border/40 my-1" />
            <View className="flex-row justify-between items-center">
              <Text className="font-medium text-sm text-foreground">Total</Text>
              <Text className="font-bold text-lg tracking-tight text-foreground">
                ₦{totalAmount.toLocaleString()}
              </Text>
            </View>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button
              onPress={handleCheckout}
              className="w-full h-11 flex-row justify-center items-center gap-2"
            >
              <Text className="text-primary-foreground font-medium text-sm">
                Proceed to Checkout
              </Text>
              <ArrowRight size={16} className="text-primary-foreground" />
            </Button>
          </CardFooter>
        </Card>
      </View>
    </SafeAreaView>
  );
}
