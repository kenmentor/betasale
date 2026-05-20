import React from "react";
// 1. Ensure regular React Native elements are explicitly imported
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 2. Double check these relative paths point perfectly to your new UI components

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top || 24,
        paddingBottom: (insets.bottom || 16) + 60,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    ></ScrollView>
  );
}
