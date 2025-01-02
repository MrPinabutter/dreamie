import { cn } from "@/utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { Text, TextProps } from "react-native";

interface TypographyProps extends TextProps, VariantProps<typeof typoVariants> {
  text: string;
  className?: string;
}

const typoVariants = cva("", {
  variants: {
    color: {
      default: "text-slate-950 dark:text-slate-50",
      gray: "text-slate-500 dark:text-slate-400",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    weight: {
      regular: "font-geist-regular",
      bold: "font-geist-bold",
      semibold: "font-geist-semibold",
      black: "font-geist-black",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
    weight: "regular",
  },
});

export const Typography = ({ text, className, ...rest }: TypographyProps) => {
  return (
    <Text
      {...rest}
      className={cn(
        typoVariants({
          color: rest.color,
          size: rest.size,
          weight: rest.weight,
        }),
        className
      )}
    >
      {text}
    </Text>
  );
};
