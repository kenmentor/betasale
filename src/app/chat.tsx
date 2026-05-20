import { useRouter } from "expo-router";
import {
  Check,
  CheckCheck,
  MessageSquareOff,
  Search,
} from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, View } from "react-native";
// Importing your verified react-native-reusables primitives
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isVerifiedVendor: boolean;
  status: "sent" | "delivered" | "read";
}

const INITIAL_CHATS: ChatThread[] = [
  {
    id: "1",
    name: "Classic Wear",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    lastMessage:
      "Your order for the Baggy Jeans has been dispatched and is on its way.",
    timestamp: "14:32",
    unreadCount: 2,
    isVerifiedVendor: true,
    status: "read",
  },
  {
    id: "2",
    name: "Apex Athletics",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    lastMessage: "Do you have the Sport Crewneck available in size XL?",
    timestamp: "Yesterday",
    unreadCount: 0,
    isVerifiedVendor: false,
    status: "read",
  },
  {
    id: "3",
    name: "Ezinne Styles",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    lastMessage:
      "Thanks for purchasing! Let me know when you receive the package.",
    timestamp: "12 May",
    unreadCount: 0,
    isVerifiedVendor: true,
    status: "delivered",
  },
];

export default function ChatHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats] = useState<ChatThread[]>(INITIAL_CHATS);
  const router = useRouter();

  // Filter threads based on search input
  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Status indicator component for your message read states
  const StatusIcon = ({ status }: { status: ChatThread["status"] }) => {
    if (status === "read")
      return <CheckCheck size={16} className="text-primary" />;
    if (status === "delivered")
      return <CheckCheck size={16} className="text-muted-foreground/60" />;
    return <Check size={16} className="text-muted-foreground/60" />;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Structural Header */}
      <View className="px-6 pt-5 pb-3">
        <Text className="font-bold text-2xl tracking-tight text-foreground">
          Messages
        </Text>
        <Text className="text-muted-foreground text-sm mt-0.5">
          Manage your conversations with vendors and buyers
        </Text>
      </View>

      {/* Search Bar Container */}
      <View className="px-6 py-2 mb-2">
        <View className="relative justify-center">
          <Search
            size={16}
            className="absolute left-3 text-muted-foreground z-10"
          />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="pl-10 h-10 bg-muted/40 border-border/50 text-sm"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Chat Thread List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20 gap-3">
            <View className="w-12 h-12 border border-dashed border-border rounded-full items-center justify-center">
              <MessageSquareOff size={20} className="text-muted-foreground" />
            </View>
            <Text className="font-semibold text-base text-foreground">
              No conversations found
            </Text>
            <Text className="text-muted-foreground text-xs text-center max-w-[240px]">
              Try searching for a different vendor name or message keyword.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/chat/${item.id}`)}
            className="flex-row items-center py-4 border-b border-border/40 active:opacity-70"
          >
            {/* Avatar image container */}
            <View className="relative">
              <Image
                source={{ uri: item.avatar }}
                className="w-12 h-12 rounded-full bg-muted border border-border/20"
              />
              {/* Optional: Green active indicator dot can go here */}
            </View>

            {/* Conversation text content block */}
            <View className="flex-1 ml-3 mr-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5 flex-1 pr-2">
                  <Text
                    className="font-semibold text-sm text-foreground tracking-tight"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {item.isVerifiedVendor && (
                    <View className="w-3.5 h-3.5 bg-primary rounded-full items-center justify-center">
                      <Text className="text-[8px] font-black text-primary-foreground text-center">
                        ✓
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="text-muted-foreground text-xs">
                  {item.timestamp}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-1 gap-4">
                <Text
                  className={`text-sm flex-1 ${item.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>

                {/* Meta states column: Shows count badge if unread, or checkmarks if read */}
                <View className="min-w-[20px] items-end justify-center">
                  {item.unreadCount > 0 ? (
                    <Badge
                      variant="default"
                      className="h-5 px-1.5 min-w-[20px] justify-center items-center rounded-full bg-primary"
                    >
                      <Text className="text-[10px] font-bold text-primary-foreground leading-none">
                        {item.unreadCount}
                      </Text>
                    </Badge>
                  ) : (
                    <StatusIcon status={item.status} />
                  )}
                </View>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
