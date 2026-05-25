import { useMarketplaceStore } from "@/lib/marketplace-store";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function CartScreen() {
  const { cart, removeFromCart, updateCartQuantity } = useMarketplaceStore();
  const total = useMarketplaceStore((s) => s.getCartTotal());

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pt-16 pb-3">
        <Text className="text-2xl font-bold text-foreground">Shopping Cart</Text>
        <Text className="text-sm text-muted-foreground mt-1">
          {cart.length} {cart.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {cart.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <ShoppingBag size={64} color="#8C7B63" />
          <Text className="mt-4 text-lg font-semibold text-foreground">
            Your cart is empty
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground text-center">
            Browse products and add items to your cart
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)")}
            className="mt-6 rounded-2xl bg-primary px-8 py-3"
          >
            <Text className="text-base font-bold text-primary-foreground">
              Start Shopping
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1 px-5"
            showsVerticalScrollIndicator={false}
          >
            {cart.map((item) => (
              <View
                key={item.productId}
                className="mb-3 flex-row items-center rounded-2xl border border-border bg-card p-3"
              >
                <Image
                  source={{ uri: item.imageUri }}
                  className="h-20 w-20 rounded-xl"
                  contentFit="cover"
                />
                <View className="ml-3 flex-1">
                  <Text
                    className="text-sm font-semibold text-foreground leading-tight"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-0.5">
                    {item.seller}
                  </Text>
                  <Text className="mt-1 text-base font-bold text-primary">
                    ${item.price}
                  </Text>

                  <View className="mt-2 flex-row items-center gap-3">
                    <Pressable
                      onPress={() => updateCartQuantity(item.productId, -1)}
                      className="h-7 w-7 items-center justify-center rounded-lg border border-border bg-secondary"
                    >
                      <Minus size={12} color="#412D15" />
                    </Pressable>
                    <Text className="text-sm font-bold text-foreground min-w-[20px] text-center">
                      {item.quantity}
                    </Text>
                    <Pressable
                      onPress={() => updateCartQuantity(item.productId, 1)}
                      className="h-7 w-7 items-center justify-center rounded-lg border border-border bg-secondary"
                    >
                      <Plus size={12} color="#412D15" />
                    </Pressable>
                  </View>
                </View>

                <View className="items-end gap-2">
                  <Text className="text-sm font-bold text-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <Pressable
                    onPress={() => removeFromCart(item.productId)}
                    className="h-8 w-8 items-center justify-center rounded-xl bg-destructive"
                  >
                    <Trash2 size={14} color="#BF4040" />
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="border-t border-border bg-card px-5 py-4">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm text-muted-foreground">Subtotal</Text>
              <Text className="text-sm text-foreground">${total.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm text-muted-foreground">Shipping</Text>
              <Text className="text-sm text-primary font-medium">
                {total >= 200 ? "Free" : "$15.00"}
              </Text>
            </View>
            <View className="h-px bg-border mb-3" />
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-bold text-foreground">Total</Text>
              <Text className="text-xl font-extrabold text-primary">
                ${(total >= 200 ? total : total + 15).toFixed(2)}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/payment")}
              className="items-center rounded-2xl bg-primary py-4 active:opacity-80"
            >
              <Text className="text-base font-bold text-primary-foreground">
                Proceed to Checkout
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
