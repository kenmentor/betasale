import { useMarketplaceStore } from "@/lib/marketplace-store";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const signIn = useMarketplaceStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) return;
    signIn(email.trim(), password);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView
      className="flex-1 bg-primary dark:bg-secondary"
      edges={["top"]}
    >
      <View className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-primary/80 dark:bg-background/40" />
      <View className="absolute right-[-74px] top-40 h-72 w-72 rounded-full bg-primary/70 dark:bg-background/35" />

      <View className="px-6 pt-4">
        <Text className="text-center text-5xl font-extrabold tracking-tight text-primary-foreground uppercase font-mono dark:text-foreground">
          BetaSale
        </Text>
        <Text className="mt-1 text-center text-[14px] text-primary-foreground/80 dark:text-foreground/75">
          Buy & Sell with confidence.
        </Text>

        <View className="mt-6 rounded-[30px] border border-white/20 bg-white/10 p-3">
          <Image
            source={require("../../../assets/images/auth.png")}
            style={{ width: "100%", height: 240 }}
            contentFit="contain"
          />
        </View>
      </View>

      <View className="mt-6 flex-1 rounded-t-[36px] bg-card px-6 pb-8 pt-8 overflow-hidden">
        <Text className="absolute -top-8 right-[-40px] text-[140px] font-extrabold text-foreground opacity-[0.04] tracking-tighter">
          BETASALE
        </Text>
        <View className="self-center rounded-full bg-secondary px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-[1px] text-secondary-foreground">
            Welcome Back
          </Text>
        </View>

        <View className="mt-6 gap-4">
          <View className="rounded-2xl border border-border bg-muted px-4 py-3">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#8C7B63"
              autoCapitalize="none"
              keyboardType="email-address"
              className="text-base text-foreground"
            />
          </View>

          <View className="rounded-2xl border border-border bg-muted px-4 py-3">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#8C7B63"
              secureTextEntry
              className="text-base text-foreground"
            />
          </View>

          <Pressable
            onPress={handleSignIn}
            className="mt-2 items-center rounded-2xl bg-primary py-4"
          >
            <Text className="text-base font-bold text-primary-foreground">
              Sign In
            </Text>
          </Pressable>
        </View>

        <Text className="mt-6 text-center text-xs leading-5 text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </SafeAreaView>
  );
}
