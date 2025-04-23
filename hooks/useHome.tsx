import { MoodLevel } from "@/constants/moods";
import { differenceInHours, isAfter, startOfDay, subDays } from "date-fns";
import { router } from "expo-router";
import { useDreams } from "./useDreams";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";

export const useHome = () => {
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
    if (dreams.length === 0)
      return ToastAndroid.show("No dreams found", ToastAndroid.SHORT);
    const randomIndex = Math.floor(Math.random() * dreams.length);
    router.push(`/dream/${dreams[randomIndex].id}`);
  };

  return {
    userName,
    lastWeekDreams,
    lastDream,
    avgMood,
    streak,
    handleRandomDream,
  };
};
