import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ChevronLeft,
    Image as ImageIcon,
    Send,
    Sparkles,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TextInput,
    View,
} from "react-native";
// Using your real react-native-reusables primitives
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: "me" | "them";
  status?: "sent" | "delivered" | "read";
}

export default function ActiveConversationScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Is the Sport Crewneck still available in size L?",
      timestamp: "14:28",
      sender: "me",
    },
    {
      id: "2",
      text: "Yes it is! We have just two left in stock at our warehouse.",
      timestamp: "14:30",
      sender: "them",
    },
    {
      id: "3",
      text: "Awesome. Does it run true to size or should I size up?",
      timestamp: "14:31",
      sender: "me",
    },
    {
      id: "4",
      text: "It's slightly oversized for a relaxed fit, so sticking to your true size M or L works perfectly depending on how you like it.",
      timestamp: "14:32",
      sender: "them",
    },
  ]);

  // Handle Dispatching new messages
  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "me",
      status: "sent",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Auto-scroll layout straight to the bottom edge
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* 1. TOP ROUTE HEADER BAR */}
      <View className="px-4 py-3 border-b border-border/40 flex-row items-center justify-between bg-background">
        <View className="flex-row items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9"
            onPress={() => router.back()}
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Button>
          <View>
            <Text className="font-semibold text-base tracking-tight text-foreground">
              Vendor Chat
            </Text>
            <Text className="text-muted-foreground text-xs font-medium">
              Order Reference #{id || "001"}
            </Text>
          </View>
        </View>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-border/60 flex-row gap-1"
        >
          <Sparkles size={12} className="text-primary" />
          <Text className="text-xs font-medium">Offer</Text>
        </Button>
      </View>

      {/* 2. DYNAMIC MESSAGE SCROLLER */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        className="flex-1"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            gap: 12,
          }}
          className="flex-1 bg-muted/10"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          renderItem={({ item }) => {
            const isMe = item.sender === "me";
            return (
              <View
                className={`flex-row ${isMe ? "justify-end" : "justify-start"}`}
              >
                <View
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                    isMe
                      ? "bg-primary rounded-tr-sm"
                      : "bg-muted/60 dark:bg-muted/30 rounded-tl-sm border border-border/20"
                  }`}
                >
                  <Text
                    className={`text-sm leading-relaxed ${isMe ? "text-primary-foreground" : "text-foreground"}`}
                  >
                    {item.text}
                  </Text>
                  <Text
                    className={`text-[10px] mt-1 text-right block ${
                      isMe
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.timestamp}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* 3. INPUT COMPOSER TOOLBAR */}
        <View className="p-3 border-t border-border/40 bg-background flex-row items-end gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10 border-border/60 shrink-0"
          >
            <ImageIcon size={18} className="text-muted-foreground" />
          </Button>

          {/* Flexible Input field replicating web-based textarea behaviors */}
          <View className="flex-1 min-h-[40px] max-h-[100px] border border-input rounded-xl bg-background px-3 justify-center">
            <TextInput
              placeholder="Type your message..."
              placeholderTextColor="#a3a3a3"
              value={inputText}
              onChangeText={setInputText}
              multiline
              className="text-foreground text-sm py-1.5 font-normal leading-tight"
              style={{ textAlignVertical: "center" }}
            />
          </View>

          <Button
            size="icon"
            className="w-10 h-10 shrink-0 bg-primary"
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={16} className="text-primary-foreground" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
