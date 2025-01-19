import { Button } from "@/components/atoms/Button";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { CalendarModal } from "../organisms/CalendarModal";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5;

const SPRING_CONFIG = {
  damping: 22,
  stiffness: 180,
};

interface DreamDatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const DreamDatePicker = ({
  date,
  onDateChange,
}: DreamDatePickerProps) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const modalPosition = useSharedValue(MODAL_HEIGHT);

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

  const handleDateSelect = (selectedDate: Date) => {
    onDateChange(selectedDate);
    toggleCalendar();
  };

  return (
    <>
      <Button
        variant="ghost"
        text={format(date, "MMM dd, yyyy")}
        icon="calendar"
        size={"sm"}
        onPress={toggleCalendar}
        className="dark:bg-slate-900 bg-slate-50"
      />

      <CalendarModal
        isVisible={isCalendarVisible}
        onClose={toggleCalendar}
        onDateSelect={handleDateSelect}
        modalPosition={modalPosition}
        selectedDate={date}
      />
    </>
  );
};
