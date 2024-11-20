import { cn } from "@/utils/cn";
import { TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  className?: string;
}

export const Input = ({ className, ...rest }: InputProps) => {
  return (
    <TextInput
      {...rest}
      className={cn(
        `border border-slate-200 
        rounded-lg p-3 mb-4 
        text-base font-crete 
        dark:border-slate-600 
        dark:text-slate-50 `,
        `dark:placeholder:text-slate-500`,
        className
      )}
    />
  );
};
