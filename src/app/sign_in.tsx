import { Button } from "@/components/ui/button"; // Using your existing UI button component
import {
    Eye,
    EyeOff,
    Goal,
    Lock,
    Mail,
    ScanFace,
    User,
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
("lucide-react-native");

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    console.log("Registering user:", { fullName, email, password });
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
            Create Account
          </Text>
          <Text className="text-muted-foreground text-base">
            Join us and start exploring top vendors
          </Text>
        </View>

        {/* --- FORM INPUTS --- */}
        <View className="gap-4 mb-6">
          {/* Full Name Input */}
          <View>
            <Text className="text-foreground font-medium text-sm mb-2">
              Full Name
            </Text>
            <View className="flex-row items-center bg-secondary/40 border border-border rounded-xl px-4 h-12 focus:border-primary">
              <User size={20} className="text-muted-foreground mr-3" />
              <TextInput
                className="flex-1 text-foreground text-sm h-full"
                placeholder="John Doe"
                placeholderTextColor="#a3a3a3"
                autoCapitalize="words"
                autoCorrect={false}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* Email Input */}
          <View>
            <Text className="text-foreground font-medium text-sm mb-2">
              Email Address
            </Text>
            <View className="flex-row items-center bg-secondary/40 border border-border rounded-xl px-4 h-12 focus:border-primary">
              <Mail size={20} className="text-muted-foreground mr-3" />
              <TextInput
                className="flex-1 text-foreground text-sm h-full"
                placeholder="yourname@domain.com"
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
                placeholder="Create a secure password"
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

        {/* Disclaimer / Terms Link */}
        <View className="flex-row flex-wrap items-center mb-6 px-1">
          <Text className="text-muted-foreground text-xs">
            By signing up, you agree to our{" "}
          </Text>
          <TouchableOpacity>
            <Text className="text-primary font-semibold text-xs">
              Terms of Service
            </Text>
          </TouchableOpacity>
          <Text className="text-muted-foreground text-xs"> and </Text>
          <TouchableOpacity>
            <Text className="text-primary font-semibold text-xs">
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- REGISTER BUTTON --- */}
        <Button className="w-full h-12 rounded-xl mb-6" onPress={handleSignUp}>
          <Text className="text-primary-foreground font-bold text-base">
            Sign Up
          </Text>
        </Button>

        {/* --- DIVIDER --- */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-[1px] bg-border" />
          <Text className="text-muted-foreground px-3 text-xs font-medium uppercase tracking-wider">
            Or register with
          </Text>
          <View className="flex-1 h-[1px] bg-border" />
        </View>

        {/* --- SOCIAL SIGN UP BUTTONS --- */}
        <View className="flex-row gap-4 mb-8">
          {/* Google */}
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center border border-border h-12 rounded-xl bg-card active:bg-secondary/40"
            onPress={() => console.log("Google Sign Up")}
          >
            <Goal size={20} className="text-foreground mr-2" />
            <Text className="text-foreground font-semibold text-sm">
              Google
            </Text>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center border border-border h-12 rounded-xl bg-card active:bg-secondary/40"
            onPress={() => console.log("Facebook Sign Up")}
          >
            <ScanFace size={20} className="text-foreground mr-2" />
            <Text className="text-foreground font-semibold text-sm">
              Facebook
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Toggle Link */}
        <View className="flex-row justify-center pb-6 mt-auto">
          <Text className="text-muted-foreground text-sm">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text className="text-primary font-bold text-sm">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
