import { Tabs } from "expo-router";
import {
    Compass,
    MessageSquare,
    ShoppingBag,
    Store,
} from "lucide-react-native";
import React from "react";
import { Platform, View } from "react-native";

// Fallback background styling variable mapping for safety matching tailwind configs
const COLORS = {
  background: "#ffffff", // Maps directly to your light theme bg tokens
  border: "rgba(228, 228, 231, 0.6)", // Border matching tailwind border/40
  primary: "#000000", // Matches your text-foreground/primary active indicator
  muted: "#a3a3a3", // Matches text-muted-foreground
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // 1. Structural Layer Customizations
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,

        // 2. Navigation Label Typography Specs
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          letterSpacing: -0.1,
          paddingBottom: Platform.OS === "ios" ? 0 : 4,
        },

        // 3. Main Bottom Panel Bar Styling
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          elevation: 0, // Removes Android shadow casting
          shadowOpacity: 0, // Removes iOS header drop shadows
          height: Platform.OS === "ios" ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
        },
      }}
    >
      {/* SCREEN A: HOME / MARKETPLACE */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Market",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? "scale-105 transition-transform" : ""}>
              <Store
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* SCREEN B: EXPLORE / CATEGORIES DEEP SEARCH */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? "scale-105 transition-transform" : ""}>
              <Compass
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* SCREEN C: USER SHOPPING CART */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? "scale-105 transition-transform" : ""}>
              <ShoppingBag
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* SCREEN D: CONVERSATION & COMMUNICATIONS HISTORY */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, focused }) => (
            <View className={focused ? "scale-105 transition-transform" : ""}>
              <MessageSquare
                size={20}
                color={color}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
