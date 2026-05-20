import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Minus, Plus, Trash2 } from "lucide-react-native";
import React from "react";
import { Image, View } from "react-native";
// Import your freshly added AlertDialog components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface CartItemType {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  thumbnail: string;
}

interface CartItemProps {
  item: CartItemType;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  return (
    <View className="flex-row items-center justify-between border-b border-border/50 py-4 last:border-b-0">
      <View className="flex-row items-center flex-1 mr-4">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-16 h-16 rounded-md bg-muted border border-border/20"
          resizeMode="cover"
        />

        <View className="ml-3 flex-1 justify-center">
          <Text
            className="font-medium text-sm tracking-tight native:text-base"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {item.size && (
            <Text className="text-muted-foreground text-xs native:text-sm mt-0.5">
              Size: {item.size}
            </Text>
          )}
          <Text className="font-semibold text-sm native:text-base mt-1">
            ₦{(item.price * item.quantity).toLocaleString()}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {/* Stepper Inputs */}
        <View className="flex-row items-center border border-input bg-background rounded-md h-9 px-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 native:w-8 native:h-8"
            onPress={() => onDecrement(item.id)}
          >
            <Minus
              size={14}
              className="text-muted-foreground"
              strokeWidth={2.5}
            />
          </Button>

          <Text className="font-medium text-sm px-2 min-w-[24px] text-center">
            {item.quantity}
          </Text>

          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 native:w-8 native:h-8"
            onPress={() => onIncrement(item.id)}
          >
            <Plus
              size={14}
              className="text-muted-foreground"
              strokeWidth={2.5}
            />
          </Button>
        </View>

        {/* Declarative AlertDialog Trigger Context */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 border-input active:bg-destructive/10 group"
            >
              <Trash2
                size={14}
                className="text-muted-foreground group-active:text-destructive"
              />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="max-w-[90%] sm:max-w-[380px] rounded-lg">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold tracking-tight">
                Remove Item?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground text-sm mt-1">
                Are you sure you want to remove "{item.title}" from your
                shopping cart? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex-row gap-3 mt-4 justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline" className="flex-1 native:flex-none">
                  <Text>Cancel</Text>
                </Button>
              </AlertDialogCancel>

              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  className="flex-1 native:flex-none bg-destructive"
                  onPress={() => onRemove(item.id)}
                >
                  <Text className="text-destructive-foreground">Remove</Text>
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>
    </View>
  );
}
