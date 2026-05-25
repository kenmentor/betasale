import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardProvider } from "react-native-keyboard-controller";

import "../../global.css";

// 1. Instantiate the global cache manager
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // 2. Keyboard Layer: Manages safe interactive window insets
    <KeyboardProvider>
      {/* 3. Server State Layer: Passes the data cache downwards */}
      <QueryClientProvider client={queryClient}>
        {/* 4. Native Routing Design Layer: Injects navigation context */}
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          {/* 5. The Root Router Stack */}
          <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
      </QueryClientProvider>
    </KeyboardProvider>
  );
}
