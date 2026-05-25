import { PRODUCTS } from "@/lib/marketplace-store";
import React from "react";
import { FlatList, Text, View } from "react-native";

import ListHeroCard from "@/components/list/ListHeroCard";
import ProductCard from "@/components/list/PendingItemCard";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background relative">
      <FlatList
        className="flex-1 z-10"
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 64 }}
        columnWrapperStyle={{
          paddingHorizontal: 20,
          gap: 12,
          marginBottom: 14,
        }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListHeaderComponent={
          <View className="relative w-full mb-2">
            <ListHeroCard />
            <View className="flex-row items-center justify-between px-6 pt-12 pb-2">
              <Text className="text-xs font-bold uppercase tracking-[1.5px] text-muted-foreground">
                Featured Products
              </Text>
              <Text className="text-sm font-medium text-muted-foreground">
                {PRODUCTS.length} items
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}
