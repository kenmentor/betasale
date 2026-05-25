import { PRODUCTS, useMarketplaceStore } from "@/lib/marketplace-store";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const [qty, setQty] = useState(1);

  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground text-lg font-semibold">
          Product not found
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-12 left-4 z-10 h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
          >
            <ArrowLeft color="#111" size={20} />
          </Pressable>
          <Pressable className="absolute top-12 right-4 z-10 h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm">
            <Heart size={18} color="#666" />
          </Pressable>
          <Image
            source={{ uri: product.imageUri }}
            className="w-full h-80"
            contentFit="cover"
          />
        </View>

        <View className="p-5 gap-4">
          <View className="flex-row items-center gap-2">
            <View className="rounded-full bg-secondary px-3 py-1">
              <Text className="text-[11px] font-semibold text-secondary-foreground">
                {product.category}
              </Text>
            </View>
            {product.badge && (
              <View className="rounded-full bg-destructive px-3 py-1">
                <Text className="text-[11px] font-bold text-destructive-foreground">
                  {product.badge} OFF
                </Text>
              </View>
            )}
          </View>

          <Text className="text-2xl font-bold text-foreground leading-tight">
            {product.title}
          </Text>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <Text className="text-sm font-bold text-foreground">
                {product.rating}
              </Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              ({product.reviewsCount} reviews)
            </Text>
          </View>

          <Text className="text-sm text-muted-foreground">
            Sold by{" "}
            <Text className="font-semibold text-foreground">
              {product.seller}
            </Text>
          </Text>

          <View className="h-px bg-border" />

          <View className="flex-row items-baseline gap-2">
            <Text className="text-3xl font-extrabold text-primary">
              ${product.price}
            </Text>
            {product.originalPrice && (
              <>
                <Text className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice}
                </Text>
                <Text className="text-sm font-bold text-destructive-foreground">
                  Save ${product.originalPrice - product.price}
                </Text>
              </>
            )}
          </View>

          <View className="flex-row items-center gap-2 rounded-xl bg-muted p-3">
            <Truck size={18} color="#1F150C" />
            <Text className="text-sm text-muted-foreground flex-1">
              Free shipping on orders over $200
            </Text>
          </View>

          <View className="h-px bg-border" />

          <Text className="text-sm font-semibold text-foreground">
            Description
          </Text>
          <Text className="text-sm leading-6 text-muted-foreground">
            {product.description}
          </Text>

          <View className="h-px bg-border" />

          <Text className="text-sm font-semibold text-foreground">
            Quantity
          </Text>
          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={() => setQty(Math.max(1, qty - 1))}
              className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card"
            >
              <Minus size={18} color="#111" />
            </Pressable>
            <Text className="text-lg font-bold text-foreground w-8 text-center">
              {qty}
            </Text>
            <Pressable
              onPress={() => setQty(qty + 1)}
              className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-card"
            >
              <Plus size={18} color="#111" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-border p-4 pb-8 gap-2 bg-card">
        <Text className="text-sm text-muted-foreground text-center">
          Subtotal:{" "}
          <Text className="font-bold text-foreground">
            ${(product.price * qty).toFixed(2)}
          </Text>
        </Text>
        <Pressable
          onPress={() => {
            for (let i = 0; i < qty; i++) addToCart(product);
            router.push("/cart");
          }}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-primary py-4 active:opacity-80"
        >
          <ShoppingCart size={20} color="#fff" />
          <Text className="text-base font-bold text-primary-foreground">
            Add to Cart
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
