import { useRouter } from "expo-router";
import { ShoppingCart, Star } from "lucide-react-native";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

// Primitive imports from your Reusables layout kit
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MerchCardProps {
  id: string;
  title: string;
  price: string;
  soldCount: number;
  location: string;
  rating: number;
  storeName: string;
  imageUrl: string;
  category: string;
  onAddToCart?: () => void;
}

export default function ProductCard({
  id,
  title,
  price,
  soldCount,
  location = "Calabar",
  rating = 5,
  storeName = "margine",
  imageUrl,
  onAddToCart,
}: MerchCardProps) {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleCardPress = () => {
    router.push(`/product/${id}`);
  };

  return (
    <Pressable
      onPress={handleCardPress}
      className="active:opacity-[0.98] flex-1  mt-[10px]"
    >
      <Card className="w-full max-w-[340px] !rounded-[5px] border border-slate-100 bg-white pt-0 shadow-xl shadow-slate-100/50">
        {/* IMAGE CONTAINER & CAROUSEL DOT INDICATORS */}
        <View className="relative w-full aspect-square rounded-[5px] overflow-hidden items-center justify-center">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="contain"
          />

          {/* Static Carousel Dots */}
          <View className="absolute bottom-3 flex-row gap-1.5 justify-center w-full">
            {[0, 1, 2, 3].map((index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full ${
                  activeSlide === index
                    ? "bg-[#0E6856]"
                    : "bg-slate-200 dark:bg-zinc-700"
                }`}
              />
            ))}
          </View>
        </View>

        {/* PRODUCT DETAILS */}
        <View className="p-2">
          {" "}
          {/* 💡 Increased from p-1 to give the inner contents breathing room */}
          <CardHeader className="px-0 pt-3 pb-1">
            <CardTitle
              className="text-xs font-bold text-slate-800 leading-tight"
              numberOfLines={2}
            >
              {title}
            </CardTitle>
          </CardHeader>
          {/* METADATA INLINE BAR */}
          <CardContent className="px-0 pb-2 pt-0">
            <View className="flex-row items-center gap-1.5 flex-wrap">
              <Text className="text-base font-bold text-[#0E6856] shrink-0">
                {price}
              </Text>

              <View className="h-3 w-[1px] bg-slate-200 dark:bg-zinc-800" />

              <Text className="text-xs text-slate-400 dark:text-zinc-400 shrink-0">
                {soldCount} Sold
              </Text>

              <View className="h-3 w-[1px] bg-slate-200 dark:bg-zinc-800" />

              <Text
                className="text-xs text-slate-400 dark:text-zinc-400 line-clamp-1 flex-1 min-w-0"
                numberOfLines={1}
              >
                {location}
              </Text>
            </View>

            {/* RATING & STORE INFO ROW */}
            <View className="flex-row items-center gap-3 mt-2.5">
              <View className="flex-row items-center gap-1 shrink-0">
                <Star size={14} color="#FBC02D" fill="#FBC02D" />
                <Text className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                  {rating}
                </Text>
              </View>

              <View className="flex-row items-center gap-1 flex-1 min-w-0">
                <View className="h-3.5 w-3.5 bg-[#0E6856] rounded-full items-center justify-center shrink-0">
                  <Text className="text-[8px] text-white font-black">✓</Text>
                </View>
                <Text
                  className="text-xs font-semibold text-[#0E6856] line-clamp-1 flex-1 min-w-0"
                  numberOfLines={1}
                >
                  {storeName}
                </Text>
              </View>
            </View>
          </CardContent>
          {/* FULL-WIDTH BRAND GREEN BUTTON */}
          <Button
            style={{ backgroundColor: "#1A6E5E" }}
            className="w-full py-2.5 rounded-[5px] flex-row items-center justify-center gap-2 mt-1 active:opacity-90 shadow-none border-0"
            onPress={(e) => {
              e.stopPropagation();
              if (onAddToCart) onAddToCart();
            }}
          >
            <ShoppingCart
              size={16}
              color="#FFFFFF"
              strokeWidth={2.5}
              className="shrink-0"
            />
            <Text
              className="text-white font-bold text-sm shrink-0"
              numberOfLines={1}
            >
              Add to Cart
            </Text>
          </Button>
        </View>
      </Card>
    </Pressable>
  );
}
