import { useMarketplaceStore } from "@/lib/marketplace-store";
import { router } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function OrderSuccessScreen() {
  const orders = useMarketplaceStore((s) => s.orders);
  const latestOrder = orders[0];

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle size={48} color="#3BB77E" />
        </View>

        <Text className="mt-6 text-2xl font-extrabold text-foreground">
          Order Successful!
        </Text>
        <Text className="mt-2 text-sm text-muted-foreground text-center leading-6">
          Your order has been placed successfully.{'\n'}You will receive a confirmation shortly.
        </Text>

        {latestOrder && (
          <View className="mt-8 w-full rounded-2xl border border-border bg-card p-5">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground">
                Order ID
              </Text>
              <View className="rounded-full bg-priority-low px-2.5 py-0.5">
                <Text className="text-[10px] font-bold text-priority-low-foreground">
                  {latestOrder.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text className="mt-1 text-sm font-bold text-foreground font-mono">
              {latestOrder.id}
            </Text>

            <View className="h-px bg-border my-4" />
            <Text className="text-xs font-semibold uppercase tracking-[1px] text-muted-foreground mb-3">
              Items
            </Text>
            {latestOrder.items.map((item) => (
              <View
                key={item.productId}
                className="flex-row justify-between mb-2"
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

            <View className="h-px bg-border my-4" />
            <View className="flex-row justify-between">
              <Text className="text-base font-bold text-foreground">Total</Text>
              <Text className="text-xl font-extrabold text-primary">
                ${latestOrder.total.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </View>

      <View className="px-5 pb-8 gap-3">
        <Pressable
          onPress={() => router.push("/orders")}
          className="items-center rounded-2xl bg-primary py-4 active:opacity-80"
        >
          <Text className="text-base font-bold text-primary-foreground">
            View My Orders
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push("/(tabs)")}
          className="items-center rounded-2xl border border-border py-4 active:opacity-80"
        >
          <Text className="text-base font-bold text-foreground">
            Continue Shopping
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
