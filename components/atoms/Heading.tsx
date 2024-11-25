import { cn } from "@/utils/cn";
import { Text, TextProps } from "react-native";

interface HeadingProps extends TextProps {
  text: string;
  className?: string;
}

export const Heading = ({ text, className, ...rest }: HeadingProps) => {
  return (
    <Text
      {...rest}
      className={cn(
        "text-3xl mb-2 font-geist-black text-slate-950 dark:text-slate-50",
        className
      )}
    >
      {text}
    </Text>
  );
};
