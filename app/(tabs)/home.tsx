import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Pressable, ViewProps } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { useDreams } from "@/hooks/useDreams";
import { Feather } from "@expo/vector-icons";
import {
  isAfter,
  subDays,
  format,
  differenceInHours,
  startOfDay,
} from "date-fns";
import { MoodLevel, MOODS } from "@/constants/moods";
import { Typography } from "@/components/atoms/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <View
      className={`px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};

const HomePage = () => {
  const { dreams } = useDreams();
  const [userName, setUserName] = useState<string | null>();

  useEffect(() => {
    const getUserName = async () => {
      const fetchedUserName = await AsyncStorage.getItem("username");
      setUserName(fetchedUserName);
    };

    getUserName();
  });
  const lastWeekDreams = dreams.filter((dream) => {
    const dreamDate = new Date(dream.date);
    const weekAgo = subDays(new Date(), 7);
    return isAfter(dreamDate, weekAgo);
  });

  const lastDream = dreams[dreams.length - 1];

  const dreamWithMood = dreams.filter((dream) => dream.mood !== null);

  const avgMood = Math.round(
    dreamWithMood.reduce((acc, dream) => acc + Number(dream.mood ?? 0), 0) /
      dreamWithMood.length || 0
  ) as MoodLevel;

  const calculateStreak = () => {
    let streak = 0;

    let lastDreamDate = startOfDay(new Date(dreams[0]?.date));

    for (const dream of dreams) {
      if (differenceInHours(lastDreamDate, new Date(dream.date)) <= 24) {
        streak++;
        lastDreamDate = startOfDay(new Date(dream.date));
      } else {
        break;
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  const handleRandomDream = () => {
    const randomIndex = Math.floor(Math.random() * dreams.length);
    router.push(`/dream/${dreams[randomIndex].id}`);
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950 pt-12 px-4 relative">
      <StatusBar style="auto" />

      <View className="flex-row items-center mb-2 gap-4">
        <Text className="text-5xl h-10 text-center pt-2 font-shrikhand text-violet-600 dark:text-violet-500">
          Dreamie
        </Text>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-lg font-geist-regular text-slate-600 dark:text-slate-400">
            Welcome back,
          </Text>

          <Pressable onPress={() => router.replace("/username-setup")}>
            <Heading text={userName as string} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerClassName="flex-1 gap-4">
        {/* Streak Card */}
        <Card className="flex-row justify-between items-center">
          <View>
            <Typography text="Current Streak" color={"gray"} />

            <Typography text={`${streak} days`} size={"3xl"} weight={"bold"} />
          </View>

          <Feather name="moon" size={32} color="white" />
        </Card>

        <View className="flex-row gap-4">
          <Card className="flex-1">
            <Typography text="This Week" size={"sm"} color={"gray"} />

            <Typography
              text={`${lastWeekDreams.length} dreams`}
              weight={"bold"}
              size={"2xl"}
            />
          </Card>

          <Card className="flex-1">
            <Typography text="Avg Mood" size={"sm"} color={"gray"} />

            <View className="flex-row gap-2 items-center">
              <Typography
                text={avgMood ? MOODS[avgMood].emoji : "N/A"}
                weight={"bold"}
                size={"2xl"}
              />
              <Feather name="trending-up" size={16} color="#10b981" />
            </View>
          </Card>
        </View>

        {lastDream && (
          <Card className="gap-2">
            <Typography text="Latest Dream" size="sm" color={"gray"} />

            <Pressable onPress={() => router.push(`/dream/${lastDream.id}`)}>
              <Text className="text-base font-crete text-slate-700 dark:text-slate-300 mb-2">
                {lastDream.title}
              </Text>
              <View className="flex-row items-center">
                <Feather
                  name="clock"
                  size={14}
                  color="#94a3b8"
                  className="mr-2"
                />
                <Text className="text-sm text-slate-500 font-geist-regular dark:text-slate-400">
                  {format(new Date(lastDream.date), "MMM d, yyyy")}
                </Text>
              </View>
            </Pressable>
          </Card>
        )}

        {/* Quick Actions */}
        <View className="flex-row gap-4">
          <Button
            text="Random Dream"
            onPress={handleRandomDream}
            icon="shuffle"
            variant="ghost"
            className="flex-1 bg-slate-100 dark:bg-slate-800"
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <Button
        variant="primary"
        onPress={() => router.push("/(tabs)")}
        className="absolute bottom-8 right-8 p-5 rounded-full items-center justify-center shadow-lg"
        size="lg"
      >
        <Feather name="feather" color="white" size={24} />
      </Button>
    </View>
  );
};

export default HomePage;
