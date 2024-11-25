import { tailwindColors } from "@/utils";
import { cn } from "@/utils/cn";
import { AntDesign } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { ComponentProps } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  containerClassName?: string;
  className?: string;
  icon?: ComponentProps<typeof AntDesign>["name"];
  onPressIcon?: () => void;
}

export const Input = ({
  className,
  containerClassName,
  icon,
  onPressIcon,
  ...rest
}: InputProps) => {
  const { colorScheme } = useColorScheme();
  return (
    <View
      className={cn(
        "relative",
        containerClassName,
        icon && "items-center flex-row"
      )}
    >
      <TextInput
        {...rest}
        className={cn(
          `border border-slate-200
          rounded-lg p-3
          w-full min-h-12
          text-base font-crete
          dark:border-slate-600
          dark:text-slate-50`,
          `dark:placeholder:text-slate-500`,
          icon ? "pr-10" : undefined,
          className
        )}
      />
      {icon ? (
        <TouchableOpacity onPress={onPressIcon} className="absolute right-3">
          <AntDesign
            name={icon}
            size={16}
            color={tailwindColors.slate[colorScheme === "dark" ? 200 : 950]}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
