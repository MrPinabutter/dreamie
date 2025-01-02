import { View, Image, Text } from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

export default function UsernameSetup() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters long");
      return;
    }

    try {
      await AsyncStorage.setItem("username", username.trim());
      router.replace("/(tabs)");
    } catch {
      setError("Failed to save username. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950 px-4 justify-center pb-[20%]">
      <View className="gap-2">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-20 h-40 mx-auto mb-4"
        />

        <View className="flex-row">
          <Typography size="2xl" weight="bold">
            Welcome to{" "}
            <Text className="font-shrikhand text-violet-400">Dreamie</Text>
          </Typography>
        </View>

        <Typography
          size="md"
          text="How can we call you?"
          className="font-crete"
        />

        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your name"
          autoFocus
          autoCapitalize="words"
        />

        {error ? (
          <Typography
            text={error}
            className="text-red-500 dark:text-red-500"
            size="sm"
          />
        ) : null}

        <Button onPress={handleSubmit} text="Continue" className="mt-4" />
      </View>
    </View>
  );
}
