import { TabBarIcon } from "@/components/atoms/TabBarIcon";
import { tailwindFullConfig } from "@/utils";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: tailwindFullConfig.theme.colors.slate[950],
        tabBarInactiveBackgroundColor:
          tailwindFullConfig.theme.colors.slate[950],
        tabBarActiveTintColor: tailwindFullConfig.theme.colors.violet[500],
        tabBarInactiveTintColor: tailwindFullConfig.theme.colors.slate[50],
        tabBarStyle: {
          borderTopWidth: 0,
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
