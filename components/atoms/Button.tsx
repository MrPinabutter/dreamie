import { tailwindColors } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableOpacityProps, Text } from "react-native";
import { ComponentProps } from "react";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("rounded-lg items-center justify-center flex-row", {
  variants: {
    variant: {
      primary: "bg-violet-600 p-4",
      secondary: "bg-gray-200 p-3 dark:bg-emerald-500",
      outline: "border-2 border-violet-600 p-4 bg-transparent",
      ghost: "bg-transparent hover:bg-violet-100 p-4",
      destructive: "bg-red-600 p-4",
      success: "bg-green-600 p-4",
      link: "bg-transparent p-4 underline",
    },
    size: {
      sm: "p-2 text-sm",
      md: "p-4 text-base",
      lg: "p-6 text-lg",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
    },
    isFullWidth: {
      true: "w-full",
    },
  },
  compoundVariants: [
    {
      variant: "outline",
      disabled: true,
      className: "border-gray-300",
    },
    {
      variant: ["primary", "destructive", "success"],
      className: "text-white",
    },
    {
      variant: "ghost",
      disabled: true,
      className: "hover:bg-transparent",
    },
  ],
  defaultVariants: {
    variant: "secondary",
    size: "md",
  },
});

interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  icon?: ComponentProps<typeof Ionicons>["name"];
  text?: string;
  disabled?: boolean;
  isFullWidth?: boolean;
}

function getIconSize(size: ButtonProps["size"]): number {
  switch (size) {
    case "sm":
      return 16;
    case "lg":
      return 24;
    default:
      return 20;
  }
}

function getIconColor(variant: ButtonProps["variant"]): string {
  if (!variant) return tailwindColors.slate[800];

  switch (variant) {
    case "outline":
    case "ghost":
    case "link":
      return tailwindColors.violet[600];
    case "destructive":
    case "primary":
    case "success":
      return "white";
    default:
      return tailwindColors.slate[800];
  }
}

function getTextStyles(
  variant: ButtonProps["variant"],
  size: ButtonProps["size"]
): string {
  const baseStyles = ["font-geist-semibold"];

  if (variant) {
    if (["primary", "destructive", "success"].includes(variant)) {
      baseStyles.push("text-white");
    } else {
      baseStyles.push("dark:text-white");
    }
  }

  switch (size) {
    case "sm":
      baseStyles.push("text-sm");
      break;
    case "lg":
      baseStyles.push("text-lg");
      break;
    default:
      baseStyles.push("text-base");
  }

  return cn(...baseStyles);
}

export const Button = ({
  children,
  icon,
  text,
  variant = "primary",
  size,
  disabled,
  isFullWidth,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <TouchableOpacity
      {...rest}
      disabled={disabled}
      className={cn(
        buttonVariants({
          variant,
          size,
          disabled,
          isFullWidth,
          className,
        })
      )}
      activeOpacity={0.8}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={getIconSize(size)}
          color={getIconColor(variant)}
          className="mr-2"
        />
      ) : null}
      {text ? (
        <Text className={getTextStyles(variant, size)}>{text}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
