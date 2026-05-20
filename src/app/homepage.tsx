import ProductCard from "@/components/productCard";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowRight,
  Book,
  LucideSportShoe,
  Phone,
  Shirt,
} from "lucide-react-native";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

// 1. Define your pure fetch function
const fetchProducts = async () => {
  const response = await axios.get("https://api.escuelajs.co/api/v1/products");
  return response.data;
};

export default function ProductsScreen() {
  // 2. Use the hook.
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // 3. Handle the loading state gracefully
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#16a34a" />{" "}
        {/* Custom accent color */}
      </View>
    );
  }

  // 4. Handle any API errors safely
  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-background p-6">
        <Text className="text-destructive font-bold text-lg mb-1">
          Error loading data
        </Text>
        <Text className="text-muted-foreground text-sm text-center">
          {error.message ||
            "Something went wrong. Please check your internet connection."}
        </Text>
        <Button variant="outline" className="mt-4" onPress={() => refetch()}>
          <Text>Try Again</Text>
        </Button>
      </View>
    );
  }

  // 5. Header Component containing Billboard and Categories
  const RenderHeader = () => (
    <View className="pt-4 pb-2 px-4">
      {/* --- BILLBOARD / HERO BANNER --- */}
      <View className="w-full bg-primary/10 rounded-2xl p-5 mb-6 relative overflow-hidden border border-primary/20">
        <View className="max-w-[65%]">
          <Text className="text-primary font-bold text-xs uppercase tracking-wider mb-1">
            Recommended For You
          </Text>
          <Text
            className="text-foreground font-extrabold text-2xl mb-1"
            numberOfLines={1}
          >
            Baggy Jeans
          </Text>
          <Text className="text-foreground font-semibold text-lg mb-3">
            ₦300
          </Text>
          <Button size="sm" className="self-start px-4 rounded-full">
            <Text className="text-primary-foreground font-medium text-xs">
              Add to Cart
            </Text>
          </Button>
        </View>
        {/* Placeholder decorative element for background styling */}
        <View className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
      </View>

      {/* --- CATEGORIES SECTION --- */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-foreground font-bold text-xl tracking-tight">
            Popular Categories
          </Text>
          <Button variant="ghost" className="flex-row items-center gap-1 p-0">
            <Text className="text-primary font-semibold text-sm">See all</Text>
            <ArrowRight size={16} className="text-primary" />
          </Button>
        </View>

        {/* Horizontal Row of Categories */}
        <View className="flex-row justify-between items-center">
          {[
            {
              icon: <Shirt size={22} className="text-foreground" />,
              label: "Clothes",
            },
            {
              icon: <Book size={22} className="text-foreground" />,
              label: "Books",
            },
            {
              icon: <LucideSportShoe size={22} className="text-foreground" />,
              label: "Sports",
            },
            {
              icon: <Phone size={22} className="text-foreground" />,
              label: "Gadget",
            },
          ].map((cat, idx) => (
            <View key={idx} className="items-center flex-1">
              <Button
                variant="secondary"
                className="w-14 h-14 rounded-2xl items-center justify-center mb-2 shadow-sm"
              >
                {cat.icon}
              </Button>
              <Text className="text-muted-foreground text-xs font-medium">
                {cat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* --- RECENT PRODUCTS TITLE --- */}
      <Text className="text-foreground font-bold text-xl tracking-tight mb-3">
        Discover Products
      </Text>
    </View>
  );

  // 6. Main Scroll Container
  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={RenderHeader}
        contentContainerStyle={{ paddingBottom: 24 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
        refreshing={isLoading}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <View style={{ width: "48%" }}>
            <ProductCard
              location="Lagos"
              storeName={item.brand || "Verified Vendor"}
              soldCount={item.stock || 12}
              rating={item.rating || 4.5}
              title={item.title}
              id={item.id}
              price={item.price}
              category={item.category?.name || "General"}
              imageUrl={
                item.category?.image ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
              }
              onPress={() => console.log(`Navigate to item ${item.id}`)}
              onAddToCart={() => console.log(`Item ${item.id} added`)}
            />
          </View>
        )}
      />
    </View>
  );
}
