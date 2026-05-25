import { useMarketplaceStore } from "@/lib/marketplace-store";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const isAuthenticated = useMarketplaceStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
