import { Heading } from "@/components/atoms/Heading";
import { Input } from "@/components/atoms/Input";
import { Loader } from "@/components/atoms/Loader";
import { DreamListItem } from "@/components/molecules/DreamListItem";
import { Dream } from "@/db/schema";
import { useDreams } from "@/hooks/useDreams";
import { tailwindColors } from "@/utils";
import { Entypo } from "@expo/vector-icons";
import { format } from "date-fns";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import React, { ComponentProps, useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { CalendarModal } from "@/components/organisms/CalendarModal";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5;
const SEARCH_HEIGHT = 52;

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 90,
};

export default function TabTwoScreen() {
  const [search, setSearch] = useState("");
  const [markedDates, setMarkedDates] = useState<string[]>([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { dreams, setPage, loading, refreshDreams, getAllDreamsDates } =
    useDreams();
  const { colorScheme } = useColorScheme();

  const searchAnimation = useSharedValue(0);
  const modalPosition = useSharedValue(MODAL_HEIGHT);

  const toggleSearch = () => {
    searchAnimation.value = withTiming(searchAnimation.value === 0 ? 1 : 0, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    });
  };

  useEffect(() => {
    return () => {
      modalPosition.value = MODAL_HEIGHT;
    };
  }, []);

  const showCalendar = useCallback(() => {
    setIsCalendarVisible(true);
    modalPosition.value = withSpring(0, SPRING_CONFIG);
  }, []);

  const hideCalendar = useCallback(() => {
    modalPosition.value = withSpring(MODAL_HEIGHT, SPRING_CONFIG);
    setTimeout(() => {
      setIsCalendarVisible(false);
    }, 300);
  }, []);

  const toggleCalendar = useCallback(() => {
    if (isCalendarVisible) {
      hideCalendar();
    } else {
      showCalendar();
    }
  }, [isCalendarVisible, hideCalendar, showCalendar]);

  const searchContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: searchAnimation.value,
      display: searchAnimation.value === 0 ? "none" : "flex",
      transform: [
        {
          translateY: (1 - searchAnimation.value) * -SEARCH_HEIGHT,
        },
      ],
    };
  });

  const listContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: searchAnimation.value * SEARCH_HEIGHT,
        },
      ],
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

  const toggleFavorite = () => {
    refreshDreams(search, undefined, isFavorite ? undefined : true);
    setIsFavorite((old) => !old);
  };

  const icons = [
    {
      name: isFavorite ? "heart" : "heart-outlined",
      action: toggleFavorite,
    },
    {
      name: "calendar",
      action: toggleCalendar,
    },
    {
      name: "magnifying-glass",
      action: toggleSearch,
    },
  ] as { name: ComponentProps<typeof Entypo>["name"]; action: () => void }[];

  const loadDates = useCallback(async () => {
    const dates = (await getAllDreamsDates()).map((it) => it.date);
    setMarkedDates(dates);
  }, [getAllDreamsDates]);

  useEffect(() => {
    loadDates();
  }, []);

  const markedDatesFormatted = markedDates.map((it) => ({
    date: new Date(it),
    style: {
      backgroundColor: tailwindColors.violet[colorScheme === "dark" ? 950 : 50],
      borderRadius: 0,
    },
    textStyle: {
      color: tailwindColors.violet[colorScheme === "dark" ? 400 : 600],
    },
  }));

  return (
    <>
      <View className="flex-1 bg-white dark:bg-slate-950 pt-12">
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
                <Entypo
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

        <View className="relative h-2">
          <Animated.View
            className="overflow-hidden px-4 absolute top-4 left-0 right-0"
            style={searchContainerStyle}
          >
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
                refreshDreams(text, undefined, isFavorite ? true : undefined);
              }}
            />
          </Animated.View>
        </View>

        <Animated.View style={[{ flex: 1 }, listContainerStyle]}>
          <SectionList
            sections={Object.entries(groupDreamsByMonth).map(
              ([key, value]) => ({
                title: key,
                data: value,
              })
            )}
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
        </Animated.View>
      </View>

      <CalendarModal
        isVisible={isCalendarVisible}
        onClose={toggleCalendar}
        onDateSelect={(date) => {
          refreshDreams(
            search,
            date.toISOString(),
            isFavorite ? true : undefined
          );
          toggleCalendar();
        }}
        markedDates={markedDatesFormatted}
        modalPosition={modalPosition}
      />
    </>
  );
}
