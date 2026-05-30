import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  View,
} from "react-native";

// Core primitives utilizing your React Native Reusables / Shadcn theme engine
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

// Exact Hex definition to match your brand look
const BRAND_TEAL = "#32BDB2";

async function get_details(id: string | string[] | undefined) {
  if (!id) throw new Error("Product ID is required");
  const response = await axios.get(`https://dummyjson.com/products/${id}`);
  return response.data;
}

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // State management for selectors from your design spec
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Dynamic Query Key tracks unique instances of item IDs perfectly
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => get_details(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={BRAND_TEAL} />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-6">
        <Text className="text-destructive font-bold text-lg mb-1">
          Error Loading Details
        </Text>
        <Text className="text-muted-foreground text-sm text-center mb-4">
          {error.message}
        </Text>
        <Button variant="outline" onPress={() => router.back()}>
          <Text>Go Back</Text>
        </Button>
      </View>
    );
  }

  // Fallback defaults mapping cleanly against DummyJSON payload shapes
  const SIZES = ["L", "M", "S", "XL"];
  const displayImage = data.images?.[0] || data.thumbnail;

  return (
    <View className="flex-1 bg-background">
      {/* FLOATING HEADER CONTROLS BAR (FIXED POSITIONING OVER IMAGE) */}
      <View className="absolute top-12 left-0 right-0 z-20 px-4 flex-row justify-between items-center pointer-events-box-none">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10  items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full shadow-sm active:opacity-80"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </Pressable>

        {/* Favorite Button */}
        <Pressable
          onPress={() => setIsFavorite(!isFavorite)}
          className="h-10 w-10 items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full shadow-sm active:opacity-80"
        >
          <Heart
            size={20}
            className={
              isFavorite
                ? "text-destructive fill-destructive"
                : "text-foreground"
            }
          />
        </Pressable>
      </View>

      {/* SCROLLABLE MAIN CONTENT LAYER */}
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* HERO IMAGE BANNER */}
        <View className="w-full aspect-[4/5] bg-muted/30 items-center justify-center">
          <Image
            source={{ uri: displayImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* CORE DETAILS BOX */}
        <View className="p-5">
          <Text className="text-xl font-bold text-foreground leading-7 tracking-tight">
            {data.title}
          </Text>

          {/* Formatted to handle standard currencies nicely */}
          <Text className="text-2xl   font-black text-foreground mt-2">
            ${data.price?.toFixed(2)}
          </Text>

          <View className="flex-row items-center gap-2 mt-2 pb-4 border-b border-border/50">
            <Text className="text-xs font-semibold text-muted-foreground">
              SKU: {data.sku || "N/A"}
            </Text>
            <View className="h-3 w-[1px] bg-border" />
            <Text className="text-xs font-bold text-emerald-500">
              In Stock ({data.stock || 0})
            </Text>
          </View>

          {/* DYNAMIC SIZE SELECTOR GRID */}
          <View className="mt-5">
            <Text className="text-sm font-bold text-foreground mb-3">Size</Text>
            <View className="flex-row gap-2.5">
              {SIZES.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <Pressable
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    style={isSelected ? { backgroundColor: BRAND_TEAL } : null}
                    className={`h-11 w-12 items-center justify-center rounded-xl border ${
                      isSelected
                        ? "border-transparent"
                        : "border-border bg-card"
                    }`}
                  >
                    <Text
                      className={`font-semibold text-sm ${isSelected ? "text-white" : "text-foreground"}`}
                    >
                      {size}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* DYNAMIC QUANTITY STEPPER SELECTOR */}
          <View className="mt-6 pt-5 border-t border-border/50 flex-row items-center justify-between">
            <Text className="text-sm font-bold text-foreground">
              Select the quantity:
            </Text>
            <View className="flex-row items-center bg-secondary/60 rounded-xl p-1 border border-border/40">
              <Pressable
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 items-center justify-center active:opacity-60"
              >
                <Minus
                  size={14}
                  className="text-foreground"
                  strokeWidth={2.5}
                />
              </Pressable>

              <Text className="text-sm font-bold px-4 text-foreground">
                {quantity}
              </Text>

              <Pressable
                onPress={() => setQuantity(quantity + 1)}
                className="h-8 w-8 items-center justify-center active:opacity-60"
              >
                <Plus size={14} className="text-foreground" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>

          {/* PRODUCT DESCRIPTION ACCORDION VIEW */}
          <View className="mt-6 pt-5 border-t border-border/50">
            <Text className="text-sm font-bold text-foreground mb-2">
              Description
            </Text>
            <Text className="text-sm text-muted-foreground leading-6">
              {data.description || "No description data provided by merchant."}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* STATIC FIXED INTERACTIVE FOOTER ACTIONS */}
      <View className="px-5 pb-9 pt-4 bg-background/90 dark:bg-background/80 border-t border-border/40 flex-row gap-3 items-center backdrop-blur-md">
        <Button
          style={{ backgroundColor: BRAND_TEAL }}
          className="flex-1 h-12 rounded-xl items-center justify-center shadow-none"
          onPress={() =>
            router.push({
              pathname: "/cart",
            })
          }
        >
          <Text className="text-white font-bold text-base">Buy Now</Text>
        </Button>

        <Button
          variant="secondary"
          className="flex-1 h-12 rounded-xl flex-row items-center justify-center gap-2 border border-border/60 bg-card"
          onPress={() =>
            console.log("Added to cart payload:", {
              id: data.id,
              size: selectedSize,
              qty: quantity,
            })
          }
        >
          <ShoppingBag size={18} className="text-foreground" />
          <Text className="text-foreground font-bold text-base">
            Add to Cart
          </Text>
        </Button>
      </View>
    </View>
  );
}
