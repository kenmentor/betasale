import { useMarketplaceStore } from "@/lib/marketplace-store";
import { router } from "expo-router";
import { CreditCard, MapPin, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function PaymentScreen() {
  const { cart, placeOrder } = useMarketplaceStore();
  const [selectedMethod, setSelectedMethod] = useState("card");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    placeOrder();
    router.push("/order-success");
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pt-16 pb-4">
        <Text className="text-2xl font-bold text-foreground">Checkout</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className="text-xs font-bold uppercase tracking-[1px] text-muted-foreground mb-3">
          Shipping Address
        </Text>
        <View className="flex-row items-center rounded-2xl border border-border bg-card p-4 mb-6">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-secondary">
            <MapPin size={20} color="#412D15" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-foreground">
              {useMarketplaceStore.getState().user?.name || "User"}
            </Text>
            <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
              123 Innovation Drive, Suite 400, Tech City, NY 10001
            </Text>
          </View>
          <Pressable>
            <Text className="text-xs font-bold text-primary">Change</Text>
          </Pressable>
        </View>

        <Text className="text-xs font-bold uppercase tracking-[1px] text-muted-foreground mb-3">
          Payment Method
        </Text>

        <Pressable
          onPress={() => setSelectedMethod("card")}
          className={`flex-row items-center rounded-2xl border-2 px-4 py-4 mb-3 ${
            selectedMethod === "card"
              ? "border-primary bg-primary/5"
              : "border-border bg-card"
          }`}
        >
          <CreditCard
            size={22}
            color={selectedMethod === "card" ? "#412D15" : "#8C7B63"}
          />
          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-foreground">
              Credit / Debit Card
            </Text>
            <Text className="text-xs text-muted-foreground mt-0.5">
              Visa ending in •••• 4242
            </Text>
          </View>
          <View
            className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
              selectedMethod === "card" ? "border-primary" : "border-border"
            }`}
          >
            {selectedMethod === "card" && (
              <View className="h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </View>
        </Pressable>

        <Pressable
          onPress={() => setSelectedMethod("wallet")}
          className={`flex-row items-center rounded-2xl border-2 px-4 py-4 mb-6 ${
            selectedMethod === "wallet"
              ? "border-primary bg-primary/5"
              : "border-border bg-card"
          }`}
        >
          <View className="h-6 w-6 items-center justify-center rounded-md bg-foreground">
            <Text className="text-xs font-bold text-background">&#63743;</Text>
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-sm font-bold text-foreground">
              Apple Pay / Digital Wallet
            </Text>
          </View>
          <View
            className={`h-5 w-5 items-center justify-center rounded-full border-2 ${
              selectedMethod === "wallet" ? "border-primary" : "border-border"
            }`}
          >
            {selectedMethod === "wallet" && (
              <View className="h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </View>
        </Pressable>

        <Text className="text-xs font-bold uppercase tracking-[1px] text-muted-foreground mb-3">
          Order Summary
        </Text>
        <View className="rounded-2xl border border-border bg-card p-4 mb-4">
          {cart.map((item) => (
            <View
              key={item.productId}
              className="flex-row items-center justify-between mb-2.5"
            >
              <Text
                className="text-sm text-foreground flex-1 leading-tight"
                numberOfLines={1}
              >
                {item.title}{" "}
                <Text className="text-muted-foreground">x{item.quantity}</Text>
              </Text>
              <Text className="text-sm font-semibold text-foreground ml-2">
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View className="h-px bg-border my-3" />
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-sm text-muted-foreground">Subtotal</Text>
            <Text className="text-sm text-foreground">
              ${subtotal.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-sm text-muted-foreground">Shipping</Text>
            <Text className="text-sm text-foreground">
              {shipping === 0 ? (
                <Text className="text-primary font-medium">Free</Text>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </Text>
          </View>
          <View className="flex-row justify-between mb-1.5">
            <Text className="text-sm text-muted-foreground">Tax (8%)</Text>
            <Text className="text-sm text-foreground">${tax.toFixed(2)}</Text>
          </View>
          <View className="h-px bg-border my-3" />
          <View className="flex-row justify-between">
            <Text className="text-base font-bold text-foreground">Total</Text>
            <Text className="text-lg font-extrabold text-primary">
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-center gap-2 mb-6">
            <ShieldCheck size={16} color="#412D15" />
          <Text className="text-xs text-muted-foreground">
            Secure 256-bit SSL Encrypted Payment
          </Text>
        </View>
      </ScrollView>

      <View className="border-t border-border bg-card px-5 py-4">
        <Pressable
          onPress={handlePlaceOrder}
          className="items-center rounded-2xl bg-primary py-4 active:opacity-80"
        >
          <Text className="text-base font-bold text-primary-foreground">
            Pay ${total.toFixed(2)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
