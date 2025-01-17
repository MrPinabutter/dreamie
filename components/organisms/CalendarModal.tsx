import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { Portal } from "@gorhom/portal";
import CalendarPicker, {
  CustomDatesStylesFunc,
  CustomDateStyle,
} from "react-native-calendar-picker";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useColorScheme } from "nativewind";
import { tailwindColors } from "@/utils";
import { startOfToday } from "date-fns";

interface CalendarModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  markedDates?: CustomDateStyle[] | CustomDatesStylesFunc;
  modalPosition: SharedValue<number>;
  selectedDate?: Date;
}

export const CalendarModal = ({
  isVisible,
  onClose,
  onDateSelect,
  markedDates = [],
  modalPosition,
  selectedDate,
}: CalendarModalProps) => {
  const { colorScheme } = useColorScheme();

  const modalStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(modalPosition.value, {
          damping: 20,
          stiffness: 90,
        }),
      },
    ],
  }));

  if (!isVisible) return null;

  const handleSelectToday = () => {
    onDateSelect(new Date());
    onClose();
  };

  return (
    <Portal>
      <View className="absolute inset-0 bg-black/50">
        <Pressable className="flex-1" onPress={onClose} />
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-white pt-4 dark:bg-slate-900 rounded-t-3xl shadow-lg"
          style={modalStyle}
        >
          <CalendarPicker
            initialDate={selectedDate}
            selectedStartDate={selectedDate}
            maxDate={startOfToday()}
            onDateChange={(date) => onDateSelect(new Date(date))}
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
            disabledDatesTextStyle={{
              color:
                colorScheme === "dark"
                  ? tailwindColors.neutral[500]
                  : tailwindColors.neutral[400],
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
              { title: "Close", action: onClose },
              { title: "Today", action: handleSelectToday },
            ].map((button) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={button.action}
                key={button.title}
                className="flex-1 rounded bg-slate-50 dark:bg-slate-800 py-4"
              >
                <Text className="font-geist-medium text-slate-950 dark:text-slate-100 text-center">
                  {button.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Portal>
  );
};
