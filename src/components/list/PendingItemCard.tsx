import { Product } from "@/lib/marketplace-store";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Eye, Heart, Star } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
  item: Product;
};

const ProductCard = ({ item }: Props) => {
  console.log("Image uri: ", item.imageUri);
  const discount = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : 0;

  return (
    <View className="flex-1">
      <View className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
        <View className="relative border border-blue-900 h-40">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            }}
            style={{ width: 200, height: 200 }}
            contentFit="cover"
            transition={200}
          />
          {item.badge && (
            <View className="absolute top-2 left-2 bg-primary rounded-full px-2.5 py-1">
              <Text className="text-[10px] font-bold text-primary-foreground">
                {item.badge}
              </Text>
            </View>
          )}
          <Pressable className="absolute top-2 right-2 h-7 w-7 items-center justify-center rounded-full bg-white/80">
            <Heart size={14} color="#666" />
          </Pressable>
        </View>

        <View className="p-3 gap-1.5">
          <Pressable onPress={() => router.push(`/productDetails/${item.id}`)}>
            <Text
              className="text-[13px] font-semibold text-foreground leading-tight"
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </Pressable>

          <View className="flex-row items-center gap-1">
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            <Text className="text-[11px] font-medium text-muted-foreground">
              {item.rating}
            </Text>
            <Text className="text-[11px] text-muted-foreground">
              ({item.reviewsCount})
            </Text>
          </View>

          <View className="flex-row items-baseline gap-1.5">
            <Text className="text-base font-extrabold text-primary">
              ${item.price}
            </Text>
            {item.originalPrice && (
              <Text className="text-[11px] text-muted-foreground line-through">
                ${item.originalPrice}
              </Text>
            )}
          </View>

          <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
            by {item.seller}
          </Text>

          <Pressable
            onPress={() => router.push(`/productDetails/${item.id}`)}
            className="mt-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 active:opacity-80"
          >
            <Eye size={14} color="#fff" />
            <Text className="text-[12px] font-bold text-primary-foreground">
              View Product
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProductCard;
