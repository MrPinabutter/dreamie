import { cn } from "@/utils/cn";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <View
      className={cn(
        `px-5 py-4 rounded-lg bg-slate-100 dark:bg-slate-900 shadow-sm overflow-hidden`,
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
};
