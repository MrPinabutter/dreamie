import { TabBarIcon } from "@/components/atoms/TabBarIcon";
import { tailwindColors } from "@/utils";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor:
          colorScheme == "dark"
            ? tailwindColors.slate[950]
            : tailwindColors.white,
        tabBarInactiveBackgroundColor:
          colorScheme == "dark"
            ? tailwindColors.slate[950]
            : tailwindColors.white,
        tabBarActiveTintColor: tailwindColors.violet[500],
        tabBarInactiveTintColor:
          colorScheme == "dark"
            ? tailwindColors.slate[50]
            : tailwindColors.neutral[400],
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "newspaper" : "newspaper-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "cloud" : "cloud-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
