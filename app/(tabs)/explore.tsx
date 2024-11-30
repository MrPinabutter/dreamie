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
  withSpring,
} from "react-native-reanimated";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  RefreshControl,
  SectionList,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Pressable,
} from "react-native";
import { Input } from "@/components/atoms/Input";
import { useState, useCallback, useEffect } from "react";
import CalendarPicker, {
  CustomDatesStylesFunc,
  CustomDateStyle,
} from "react-native-calendar-picker";
import { Portal } from "@gorhom/portal";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5;

export default function TabTwoScreen() {
  const [search, setSearch] = useState("");
  const [markedDates, setMarkedDates] = useState<
    CustomDateStyle[] | CustomDatesStylesFunc | undefined
  >([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const { dreams, setPage, loading, refreshDreams, getAllDreamsDates } =
    useDreams();
  const { colorScheme } = useColorScheme();

  const searchContainerHeight = useSharedValue(0);
  const modalPosition = useSharedValue(MODAL_HEIGHT);

  const toggleSearch = () => {
    searchContainerHeight.value = searchContainerHeight.value === 0 ? 48 : 0;
  };

  const toggleCalendar = useCallback(() => {
    const isOpen = modalPosition.value === 0;
    modalPosition.value = withSpring(isOpen ? MODAL_HEIGHT : 0, {
      damping: 20,
      stiffness: 90,
    });
    setIsCalendarVisible(!isOpen);
  }, []);

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };

  const searchStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(searchContainerHeight.value, config),
      opacity: withTiming(searchContainerHeight.value === 0 ? 0 : 1, config),
    };
  });

  const modalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: modalPosition.value }],
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
      action: toggleCalendar,
    },
    {
      name: "magnifying-glass",
      action: () => {
        toggleSearch();
      },
    },
  ];

  const onDateChange = (date: Date) => {
    refreshDreams(search, date.toISOString());
    toggleCalendar();
  };

  useEffect(() => {
    const loadDates = async () => {
      const dates = await getAllDreamsDates();

      const formattedDates = dates.map((it) => ({
        date: new Date(it.date),
        style: {
          backgroundColor:
            tailwindColors.violet[colorScheme === "dark" ? 950 : 50],
          borderRadius: 0,
        },
        textStyle: {
          color: tailwindColors.violet[colorScheme === "dark" ? 400 : 600],
        },
      }));

      setMarkedDates(formattedDates);
    };

    loadDates();
  }, [colorScheme, getAllDreamsDates]);

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

        <Animated.View
          className="mt-4 overflow-hidden px-4"
          style={searchStyle}
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

      {/* Calendar Modal in Portal */}
      {isCalendarVisible && (
        <Portal>
          <View className="absolute inset-0 bg-black/50">
            <Pressable className="flex-1" onPress={toggleCalendar} />
            <Animated.View
              className="absolute bottom-0 left-0 right-0 bg-white pt-4 dark:bg-slate-900 rounded-t-3xl shadow-lg"
              style={[modalStyle]}
            >
              <CalendarPicker
                onDateChange={onDateChange}
                selectedDayColor={tailwindColors.violet[500]}
                selectedDayTextColor={
                  colorScheme === "dark"
                    ? tailwindColors.white
                    : tailwindColors.slate[950]
                }
                textStyle={{
                  color:
                    colorScheme === "dark"
                      ? tailwindColors.white
                      : tailwindColors.slate[950],
                  fontFamily: "CreteRound",
                }}
                todayBackgroundColor={
                  tailwindColors.slate[colorScheme === "dark" ? 800 : 200]
                }
                customDatesStyles={markedDates}
                headerWrapperStyle={{
                  backgroundColor: "transparent",
                }}
                dayLabelsWrapper={{
                  borderTopWidth: 0,
                  borderBottomWidth: 0,
                  borderBottomColor:
                    colorScheme === "dark"
                      ? tailwindColors.slate[800]
                      : tailwindColors.gray[200],
                  paddingBottom: 10,
                }}
                monthYearHeaderWrapperStyle={{
                  paddingTop: 0,
                }}
                monthTitleStyle={{
                  fontSize: 24,
                }}
                yearTitleStyle={{
                  fontSize: 24,
                }}
                previousComponent={
                  <View className="bg-slate-50 py-4 px-6 dark:bg-slate-950/20 rounded-lg">
                    <FontAwesome5
                      name="angle-left"
                      size={24}
                      color={tailwindColors.violet[500]}
                    />
                  </View>
                }
                nextComponent={
                  <View className="bg-slate-50 py-4 px-6 dark:bg-slate-950/20 rounded-lg">
                    <FontAwesome5
                      name="angle-right"
                      size={24}
                      color={tailwindColors.violet[500]}
                    />
                  </View>
                }
              />

              <View className="flex-row justify-between items-center p-4 dark:border-gray-800 gap-4">
                {[
                  { title: "Close", function: toggleCalendar },
                  { title: "Today", function: toggleCalendar },
                ].map((it) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={it.function}
                    key={it.title}
                    className="flex-1 rounded bg-slate-50 dark:bg-slate-800 py-4"
                  >
                    <Text className="font-geist-medium text-slate-950 dark:text-slate-100 text-center">
                      {it.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          </View>
        </Portal>
      )}
    </>
  );
}
