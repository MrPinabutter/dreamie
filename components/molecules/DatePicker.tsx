import { Button } from "@/components/atoms/Button";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { Dimensions } from "react-native";
import { CalendarModal } from "../organisms/CalendarModal";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.5;

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

  const toggleCalendar = useCallback(() => {
    const isOpen = modalPosition.value === 0;
    modalPosition.value = withSpring(isOpen ? MODAL_HEIGHT : 0, {
      damping: 20,
      stiffness: 90,
    });
    setIsCalendarVisible(!isOpen);
  }, [modalPosition]);

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
