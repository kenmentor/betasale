import "@/global.css";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

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
    ></Tabs>
  );
}
