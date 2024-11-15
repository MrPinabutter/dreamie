import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import "../global.css";
import { useColorScheme } from "@/hooks/useColorScheme";
import { database } from "@/db";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    CreteRound: require("../assets/fonts/CreteRound-Regular.ttf"),
    CreteRoundItalic: require("../assets/fonts/CreteRound-Italic.ttf"),
    Faculty: require("../assets/fonts/FacultyGlyphic-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const initDb = async () => {
      try {
        await database.init();
        console.log("Database initialized successfully");
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initDb();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
