import { useMarketplaceStore } from "@/lib/marketplace-store";
import { Image } from "expo-image";
import {
  Apple,
  Bell,
  Layers,
  Search,
  Shirt,
  Sparkles,
  Trophy,
} from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

const CATEGORIES = [
  { id: "all", name: "All", Icon: Layers },
  { id: "clothes", name: "Clothes", Icon: Shirt },
  { id: "sport", name: "Sport", Icon: Trophy },
  { id: "food", name: "Food", Icon: Apple },
  { id: "beauty", name: "Beauty", Icon: Sparkles },
];

const ListHeroCard = () => {
  const user = useMarketplaceStore((s) => s.user);
  const cartCount = useMarketplaceStore((s) => s.getCartCount());
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <View className="rounded-b-[36px] bg-primary   pt-12 shadow-md overflow-hidden p-3 ">
      <Text className="absolute -top-12 right-[-30px] text-[160px] font-extrabold text-primary-foreground opacity-[0.05] tracking-tighter">
        SHOP
      </Text>
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center space-x-3">
          <Image
            source={require("@/assets/images/android-icon-background.png")}
            className="h-12 w-12 rounded-full border-2 border-white/20"
          />
          <View>
            <Text className="text-white/70 text-xs font-medium tracking-wide uppercase">
              Welcome
            </Text>
            <Text className="text-white text-lg font-bold">
              {user?.name || "User"}
            </Text>
          </View>
        </View>

        <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/10 active:opacity-70">
          <Bell color="#ffffff" size={22} strokeWidth={2} />
          {cartCount > 0 && (
            <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Pressable>
      </View>

      <View className="flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm mb-4">
        <Search color="#8C7B63" size={20} className="mr-3" />
        <TextInput
          placeholder="Search products..."
          placeholderTextColor="#8C7B63"
          className="flex-1 text-[#1F150C] text-base font-medium h-6 p-0"
        />
      </View>

      <View className="pt-[50px] bottom-7 left-0 right-0 ">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
          className="z-1 "
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const IconComponent = cat.Icon;

            return (
              <Pressable
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                className={`flex-row items-center rounded-full px-5 py-3 shadow-sm ${
                  isActive ? "bg-[#1F150C]" : "bg-white"
                }`}
              >
                <IconComponent
                  color={isActive ? "#E1DCC9" : "#8C7B63"}
                  size={18}
                  strokeWidth={2.5}
                />
                <Text
                  className={`ml-2 text-sm font-semibold ${
                    isActive ? "text-white" : "text-[#1F150C]"
                  }`}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default ListHeroCard;
