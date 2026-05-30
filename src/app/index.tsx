import { Button } from "@/components/ui/button";
import { Link } from "expo-router";
import React from "react";
import { Dimensions, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Grab device width for fullscreen sliding scaling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function OnboardingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background ">
      <TextInput placeholder="hello world " className="outline"></TextInput>
      <Link href={"/homepage"}>
        <Button className="m-8 bg-red-400">
          <Text> hello hello </Text>
        </Button>
        <Text>HELLO WORLD</Text>
      </Link>
    </SafeAreaView>
  );
}
