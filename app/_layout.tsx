import { useFonts } from "expo-font";
import { Stack, useRootNavigationState, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { database } from "@/db";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { tailwindColors } from "@/utils";
import { PortalProvider } from "@gorhom/portal";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    CreteRound: require("../assets/fonts/CreteRound-Regular.ttf"),
    CreteRoundItalic: require("../assets/fonts/CreteRound-Italic.ttf"),
    ClimateCrisis: require("../assets/fonts/ClimateCrisis-Regular-VariableFont_YEAR.ttf"),
    Fascinate: require("../assets/fonts/Fascinate-Regular.ttf"),
    Shrikhand: require("../assets/fonts/Shrikhand-Regular.ttf"),
    Faculty: require("../assets/fonts/FacultyGlyphic-Regular.ttf"),
    "Geist-Black": require("../assets/fonts/Geist-Black.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Light": require("../assets/fonts/Geist-Light.ttf"),
    "Geist-Thin": require("../assets/fonts/Geist-Thin.ttf"),
  });

  const router = useRouter();
  const navigationState = useRootNavigationState();

  useDrizzleStudio(database.sqlite);

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

  useEffect(() => {
    const checkUsername = async () => {
      if (!navigationState?.key) return;

      try {
        const username = await AsyncStorage.getItem("username");
        if (!username) {
          router.replace("/username-setup");
        }
      } catch (error) {
        console.error("Error checking username:", error);
      }
    };

    checkUsername();
  }, [navigationState?.key, router]);

  if (!loaded) {
    return null;
  }

  return (
    <PortalProvider>
      <Stack>
        <Stack.Screen name="username-setup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="dream/[dreamId]"
          options={{
            headerShown: false,
            headerTintColor: tailwindColors.slate[50],
            headerStyle: {
              backgroundColor: tailwindColors.slate[950],
            },
            presentation: "transparentModal",
            animation: "ios_from_right",
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PortalProvider>
  );
}
