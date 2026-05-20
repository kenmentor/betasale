import { Button } from "@/components/ui/button"; // Using your existing UI button component
import {
    Eye,
    EyeOff,
    GoalIcon,
    Lock,
    Mail,
    ScanFace
} from "lucide-react-native";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log("Logging in with:", email, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 justify-center"
        keyboardShouldPersistTaps="handled"
      >
        {/* --- HEADER --- */}
        <View className="mb-8 mt-12">
          <Text className="text-foreground font-extrabold text-3xl tracking-tight mb-2">
            Welcome Back
          </Text>
          <Text className="text-muted-foreground text-base">
            Sign in to continue shopping
          </Text>
        </View>

        {/* --- FORM INPUTS --- */}
        <View className="gap-4 mb-4">
          {/* Email Input */}
          <View>
            <Text className="text-foreground font-medium text-sm mb-2">
              Email Address
            </Text>
            <View className="flex-row items-center bg-secondary/40 border border-border rounded-xl px-4 h-12 focus:border-primary">
              <Mail size={20} className="text-muted-foreground mr-3" />
              <TextInput
                className="flex-1 text-foreground text-sm h-full"
                placeholder="Enter your email"
                placeholderTextColor="#a3a3a3"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Input */}
          <View>
            <Text className="text-foreground font-medium text-sm mb-2">
              Password
            </Text>
            <View className="flex-row items-center bg-secondary/40 border border-border rounded-xl px-4 h-12 focus:border-primary">
              <Lock size={20} className="text-muted-foreground mr-3" />
              <TextInput
                className="flex-1 text-foreground text-sm h-full"
                placeholder="Enter your password"
                placeholderTextColor="#a3a3a3"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} className="text-muted-foreground" />
                ) : (
                  <Eye size={20} className="text-muted-foreground" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity className="align-self-end mb-6 items-end">
          <Text className="text-primary font-semibold text-sm">
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {/* --- LOGIN BUTTON --- */}
        <Button className="w-full h-12 rounded-xl mb-6" onPress={handleLogin}>
          <Text className="text-primary-foreground font-bold text-base">
            Login
          </Text>
        </Button>

        {/* --- DIVIDER --- */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-[1px] bg-border" />
          <Text className="text-muted-foreground px-3 text-xs font-medium uppercase tracking-wider">
            Or connect with
          </Text>
          <View className="flex-1 h-[1px] bg-border" />
        </View>

        {/* --- SOCIAL BUTTONS --- */}
        <View className="flex-row gap-4 mb-8">
          {/* Google */}
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center border border-border h-12 rounded-xl bg-card active:bg-secondary/40"
            onPress={() => console.log("Google Auth")}
          >
            <GoalIcon size={20} className="text-foreground mr-2" />
            <Text className="text-foreground font-semibold text-sm">
              Google
            </Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center border border-border h-12 rounded-xl bg-card active:bg-secondary/40"
            onPress={() => console.log("Facebook Auth")}
          >
            <ScanFace size={20} className="text-foreground mr-2" />
            <Text className="text-foreground font-semibold text-sm">
              Facebook
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Register Link */}
        <View className="flex-row justify-center pb-6 mt-auto">
          <Text className="text-muted-foreground text-sm">
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text className="text-primary font-bold text-sm">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
