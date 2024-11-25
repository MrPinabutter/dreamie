import { Heading } from "@/components/atoms/Heading";
import { Loader } from "@/components/atoms/Loader";
import { DreamListItem } from "@/components/molecules/DreamListItem";
import { Dream } from "@/db/schema";
import { useDreams } from "@/hooks/useDreams";
import { tailwindColors } from "@/utils";
import { FontAwesome6 } from "@expo/vector-icons";
import { format } from "date-fns";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import Animated, {
  withTiming,
  useAnimatedStyle,
  Easing,
  useSharedValue,
} from "react-native-reanimated";
import {
  RefreshControl,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "@/components/atoms/Input";
import { useState } from "react";

export default function TabTwoScreen() {
  const [search, setSearch] = useState("");
  const { dreams, setPage, loading, refreshDreams } = useDreams();
  const { colorScheme } = useColorScheme();

  const searchContainerHeight = useSharedValue(0);
  const toggleSearch = () => {
    searchContainerHeight.value = searchContainerHeight.value === 0 ? 48 : 0;
  };

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const style = useAnimatedStyle(() => {
    return {
      height: withTiming(searchContainerHeight.value, config),
      opacity: withTiming(searchContainerHeight.value === 0 ? 0 : 1, config),
    };
  });

  const groupDreamsByMonth: Record<string, Dream[]> = dreams.reduce(
    (acc: Record<string, Dream[]>, item) => {
      const month = format(new Date(item.date), "MMMM");

      return {
        ...acc,
        [month]: [...(acc[month] || []), item],
      };
    },
    {}
  );

  const icons = [
    {
      name: "calendar-check",
      action: () => {},
    },
    {
      name: "magnifying-glass",
      action: () => {
        toggleSearch();
      },
    },
  ];

  return (
    <View className={"flex-1 bg-white dark:bg-slate-950 pt-12"}>
      <StatusBar style="auto" />

      <View className="flex-row justify-between px-4">
        <Heading text="Dreams" />
        <View className="flex-row gap-6">
          {icons.map((icon) => (
            <TouchableOpacity
              key={icon.name}
              activeOpacity={0.8}
              onPress={icon.action}
            >
              <FontAwesome6
                name={icon.name}
                size={24}
                color={
                  colorScheme === "dark"
                    ? tailwindColors.white
                    : tailwindColors.slate[950]
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Animated.View className="mt-4 overflow-hidden px-4" style={style}>
        <Input
          icon={"closecircle"}
          onPressIcon={() => {
            toggleSearch();
            if (search) {
              setSearch("");
              refreshDreams();
            }
          }}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            refreshDreams(text);
          }}
        />
      </Animated.View>

      <SectionList
        sections={Object.entries(groupDreamsByMonth).map(([key, value]) => ({
          title: key,
          data: value,
        }))}
        className="px-4"
        onEndReached={() => setPage((old) => old + 1)}
        stickySectionHeadersEnabled={true}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshDreams}
            colors={["#4285F4"]}
            tintColor="#4285F4"
          />
        }
        renderSectionHeader={({ section: { title } }) => (
          <View className="flex-row items-center bg-white py-4 dark:bg-slate-950">
            <Text className="font-faculty text-2xl mr-4 text-slate-800 dark:text-slate-200">
              {title}
            </Text>
            <View className="flex-1 h-px bg-slate-500 dark:text-slate-200" />
          </View>
        )}
        renderItem={DreamListItem}
        ListFooterComponent={<Loader isLoading={loading} />}
      />
    </View>
  );
}
