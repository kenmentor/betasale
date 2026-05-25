import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";

const UserProfile = () => {
  return (
    <View className="rounded-3xl border border-border bg-card p-4">
      <View className="flex-row items-center gap-3">
        <View className="size-12 rounded-full bg-primary items-center justify-center">
          <FontAwesome6 name="user" size={18} color="#fff" />
        </View>
        <View className="flex-1">
          <Text className="text-xs uppercase tracking-[1px] text-muted-foreground">
            Grocery Shopper
          </Text>
          <Text className="mt-1 text-lg font-bold text-foreground">Welcome!</Text>
        </View>
      </View>
    </View>
  );
};
export default UserProfile;
