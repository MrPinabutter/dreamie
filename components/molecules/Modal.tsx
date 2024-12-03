import { tailwindColors } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { ComponentProps } from "react";
import { View, Text, Modal, Pressable } from "react-native";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  icon?: ComponentProps<typeof Ionicons>["name"];
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const CustomModal = ({
  isVisible,
  onClose,
  icon,
  title,
  description,
  children,
}: ModalProps) => {
  const { colorScheme } = useColorScheme();
  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      transparent
      statusBarTranslucent
      animationType="fade"
    >
      <View className="flex-1 relative items-center justify-center bg-black/50">
        <Pressable
          onPress={onClose}
          className="absolute top-0 bottom-0 left-0 right-0"
        />
        <View className="bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative w-4/5">
          <Ionicons
            name={icon}
            color={
              colorScheme === "dark"
                ? tailwindColors.slate[900]
                : tailwindColors.violet[300]
            }
            size={220}
            className="absolute -bottom-[60px]"
          />
          <View className="items-center pt-8 pb-4 gap-2 w-full">
            <View className="flex-row gap-4 px-8 w-full">
              <Text className="text-3xl font-geist-black text-slate-800 dark:text-white">
                {title}
              </Text>
            </View>

            {description && (
              <Text className="text-base font-geist text-slate-700 dark:text-slate-300 px-8 w-full mb-4">
                {description}
              </Text>
            )}

            {children ? <View className="px-6 w-full">{children}</View> : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};
