import { useRouter } from "expo-router";
import {
    ArrowRight,
    Footprints,
    Laptop,
    Search,
    Shirt,
    SlidersHorizontal,
    Sparkles
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    SafeAreaView,
    ScrollView,
    View,
} from "react-native";
// Using your real react-native-reusables primitives
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

// --- DATA STRUCTURES ---
interface SubCategory {
  id: string;
  name: string;
  itemCount: number;
}

interface CategoryGroup {
  id: string;
  name: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  subcategories: SubCategory[];
}

const CATEGORIES_DATA: CategoryGroup[] = [
  {
    id: "apparel",
    name: "Apparel",
    icon: Shirt,
    subcategories: [
      { id: "ap-1", name: "Baggy Jeans & Denim", itemCount: 342 },
      { id: "ap-2", name: "Hoodies & Crewnecks", itemCount: 198 },
      { id: "ap-3", name: "Graphic T-Shirts", itemCount: 512 },
      { id: "ap-4", name: "Traditional Attire", itemCount: 89 },
    ],
  },
  {
    id: "footwear",
    name: "Footwear",
    icon: Footprints,
    subcategories: [
      { id: "fw-1", name: "Sneakers & Kicks", itemCount: 271 },
      { id: "fw-2", name: "Slides & Sandals", itemCount: 143 },
      { id: "fw-3", name: "Loafers & Formals", itemCount: 65 },
    ],
  },
  {
    id: "electronics",
    name: "Tech & Gadgets",
    icon: Laptop,
    subcategories: [
      { id: "el-1", name: "Smartphones", itemCount: 120 },
      { id: "el-2", name: "Wireless Earbuds", itemCount: 94 },
      { id: "el-3", name: "Laptops & Chargers", itemCount: 43 },
    ],
  },
  {
    id: "beauty",
    name: "Cosmetics",
    icon: Sparkles,
    subcategories: [
      { id: "bt-1", name: "Skincare", itemCount: 112 },
      { id: "bt-2", name: "Fragrances & Perfumes", itemCount: 88 },
    ],
  },
];

export default function CategorySearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("apparel");

  // --- ACTIONS ---
  const handleSelectSubcategory = (subCatName: string) => {
    // Navigates to search results with parameters preset
    router.push({
      pathname: "/search/results",
      params: { category: subCatName },
    });
  };

  // --- FILTERING LOGIC ---
  // If the user types, look through ALL subcategories instantly
  const isSearching = searchQuery.trim().length > 0;

  const globalSearchResults = useMemo(() => {
    if (!isSearching) return [];
    const results: { parentName: string; sub: SubCategory }[] = [];

    CATEGORIES_DATA.forEach((parent) => {
      parent.subcategories.forEach((sub) => {
        if (sub.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ parentName: parent.name, sub });
        }
      });
    });
    return results;
  }, [searchQuery, isSearching]);

  const activeCategoryData = useMemo(() => {
    return (
      CATEGORIES_DATA.find((cat) => cat.id === activeTab) || CATEGORIES_DATA[0]
    );
  }, [activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* HEADER SECTION */}
      <View className="px-6 pt-5 pb-2">
        <Text className="font-bold text-2xl tracking-tight text-foreground">
          Explore
        </Text>
        <Text className="text-muted-foreground text-sm mt-0.5">
          Find curated items across local marketplace hubs
        </Text>
      </View>

      {/* SEARCH AND FILTER ANCHOR */}
      <View className="px-6 py-3 flex-row gap-2 items-center">
        <View className="flex-1 relative justify-center">
          <Search
            size={16}
            className="absolute left-3 text-muted-foreground z-10"
          />
          <Input
            placeholder="Search categories or items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="pl-10 h-11 bg-muted/40 border-border/50 text-sm rounded-xl"
            clearButtonMode="while-editing"
          />
        </View>
        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 rounded-xl border-border/60"
        >
          <SlidersHorizontal size={16} className="text-foreground" />
        </Button>
      </View>

      {/* RENDER MODE A: DYNAMIC FILTER RESULTS */}
      {isSearching ? (
        <FlatList
          data={globalSearchResults}
          keyExtractor={(item) => item.sub.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 12 }}
          className="flex-1"
          ListEmptyComponent={
            <View className="pt-12 items-center justify-center gap-2">
              <Text className="font-medium text-sm text-muted-foreground">
                No matching categories found
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleSelectSubcategory(item.sub.name)}
              className="flex-row items-center justify-between py-4 border-b border-border/30 active:opacity-70"
            >
              <View>
                <Text className="font-medium text-sm text-foreground">
                  {item.sub.name}
                </Text>
                <Text className="text-[11px] text-muted-foreground mt-0.5">
                  In {item.parentName}
                </Text>
              </View>
              <ArrowRight size={14} className="text-muted-foreground/60" />
            </Pressable>
          )}
        />
      ) : (
        /* RENDER MODE B: TWO-COLUMN STANDARD DEEP INDEX */
        <View className="flex-1 flex-row">
          {/* LEFT RAIL: PRIMARY TABS */}
          <View className="w-28 border-r border-border/40 bg-muted/20">
            <ScrollView showsVerticalScrollIndicator={false}>
              {CATEGORIES_DATA.map((category) => {
                const IconComponent = category.icon;
                const isActive = category.id === activeTab;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => setActiveTab(category.id)}
                    className={`py-5 px-3 items-center gap-2 border-l-2 ${
                      isActive
                        ? "border-primary bg-background"
                        : "border-transparent"
                    }`}
                  >
                    <IconComponent
                      size={20}
                      className={
                        isActive ? "text-primary" : "text-muted-foreground/80"
                      }
                    />
                    <Text
                      className={`text-[11px] text-center tracking-tight max-w-[80px] ${
                        isActive
                          ? "font-semibold text-foreground"
                          : "font-normal text-muted-foreground"
                      }`}
                    >
                      {category.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* RIGHT RAIL: NESTED SUB-ITEMS CONTAINER */}
          <View className="flex-1 bg-background">
            <FlatList
              data={activeCategoryData.subcategories}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 20, gap: 10 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Card className="border-border/40 shadow-none bg-card active:opacity-80">
                  <Pressable onPress={() => handleSelectSubcategory(item.name)}>
                    <CardContent className="p-4 flex-row items-center justify-between">
                      <View className="gap-0.5">
                        <Text className="font-medium text-sm text-foreground tracking-tight">
                          {item.name}
                        </Text>
                        <Text className="text-xs text-muted-foreground">
                          {item.itemCount} items listed
                        </Text>
                      </View>
                      <ArrowRight
                        size={14}
                        className="text-muted-foreground/40"
                      />
                    </CardContent>
                  </Pressable>
                </Card>
              )}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
