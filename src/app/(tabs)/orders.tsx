import { useMarketplaceStore } from "@/lib/marketplace-store";
import { router } from "expo-router";
import { Package, ShoppingBag } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function OrdersScreen() {
  const { orders, user } = useMarketplaceStore();

  return (
    <View className="flex-1 bg-background">
      <View className="px-5 pt-16 pb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-foreground">My Orders</Text>
          <Text className="text-sm text-muted-foreground mt-1">
            Welcome back, {user?.name || "User"}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            useMarketplaceStore.getState().signOut();
            router.replace("/(auth)/sign-in");
          }}
          className="rounded-xl bg-destructive px-4 py-2.5 border border-destructive"
        >
          <Text className="text-xs font-bold text-destructive-foreground">
            Sign Out
          </Text>
        </Pressable>
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Package size={64} color="#8C7B63" />
          <Text className="mt-4 text-lg font-semibold text-foreground">
            No orders yet
          </Text>
          <Text className="mt-1 text-sm text-muted-foreground text-center">
            Start shopping to see your orders here
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)")}
            className="mt-6 rounded-2xl bg-primary px-8 py-3"
          >
            <Text className="text-base font-bold text-primary-foreground">
              Browse Products
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
        >
          {orders.map((order) => (
            <View
              key={order.id}
              className="mb-4 rounded-2xl border border-border bg-card overflow-hidden"
            >
              <View className="flex-row items-center justify-between bg-muted px-4 py-3">
                <View>
                  <Text className="text-xs text-muted-foreground">
                    Order placed
                  </Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {order.date}
                  </Text>
                </View>
                <View
                  className={`rounded-full px-3 py-1 ${
                    order.status === "pending"
                      ? "bg-priority-medium"
                      : order.status === "shipped"
                        ? "bg-blue-100"
                        : "bg-priority-low"
                  }`}
                >
                  <Text className="text-xs font-bold capitalize text-foreground">
                    {order.status}
                  </Text>
                </View>
              </View>

              <View className="px-4 py-3">
                <Text className="text-[11px] text-muted-foreground font-mono">
                  #{order.id}
                </Text>

                <View className="h-px bg-border my-3" />

                {order.items.map((item) => (
                  <View
                    key={item.productId}
                    className="flex-row items-center justify-between mb-2"
                  >
                    <Text
                      className="text-sm text-foreground flex-1 leading-tight"
                      numberOfLines={1}
                    >
                      {item.title}{" "}
                      <Text className="text-muted-foreground">
                        x{item.quantity}
                      </Text>
                    </Text>
                    <Text className="text-sm font-semibold text-foreground ml-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                ))}

                <View className="h-px bg-border my-3" />

                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-muted-foreground">
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "items"}
                  </Text>
                  <Text className="text-base font-extrabold text-primary">
                    ${order.total.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
