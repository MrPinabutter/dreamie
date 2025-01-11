import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  View,
  Modal,
  Dimensions,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dream } from "@/db/schema";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useDreams } from "@/hooks/useDreams";
import { tailwindColors } from "@/utils";
import { useColorScheme } from "nativewind";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { CustomModal } from "./Modal";
import { Button } from "../atoms/Button";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const DreamListItem = ({ item: dream }: { item: Dream }) => {
  const { toggleSound, isPlaying } = useAudioRecorder();
  const { deleteDream, toggleFavoriteDream } = useDreams();
  const [menuVisible, setMenuVisible] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const { colorScheme } = useColorScheme();

  const handleEdit = () => {
    setMenuVisible(false);
    router.navigate(`../dream/${dream.id}`);
  };

  const handleDelete = () => {
    setMenuVisible(false);
    setConfirmModal(true);
  };

  const handleMenuPress = (event: GestureResponderEvent) => {
    const { pageY, pageX } = event.nativeEvent;
    setMenuPosition({
      top: pageY - 10,
      right: SCREEN_WIDTH - pageX,
    });
    setMenuVisible(true);
  };

  return (
    <>
      <TouchableOpacity
        key={dream.id}
        className="bg-gray-50 p-4 pb-3 rounded-lg mb-4 relative dark:bg-slate-900"
        activeOpacity={0.9}
        onPress={() => router.navigate(`../dream/${dream.id}`)}
      >
        {!!dream.title && (
          <Text
            className={cn(
              "text-xl font-geist-bold dark:text-slate-50 pr-4",
              !dream.description && "mb-2"
            )}
          >
            {dream.title}
          </Text>
        )}

        {!!dream.description && (
          <Text
            className={cn("text-base mb-2 font-crete dark:text-slate-300", {
              "pr-4": !dream.title,
            })}
          >
            {dream.description.slice(0, 200)}
            {dream.description.length > 200 && "..."}
          </Text>
        )}

        {JSON.parse(dream.images ?? "[]").length > 0 && (
          <ScrollView horizontal className="mb-2">
            {JSON.parse(dream.images ?? "[]").map((uri: string) => (
              <Image
                key={`${dream.id}-${uri}`}
                source={{ uri }}
                className="w-20 h-20 rounded-lg mr-2"
              />
            ))}
          </ScrollView>
        )}

        {dream.audioUrl && (
          <TouchableOpacity
            className="bg-gray-200 p-2 rounded-lg flex-row items-center justify-center my-2"
            onPress={() => toggleSound(dream.audioUrl!)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isPlaying ? "stop" : "play"}
              size={16}
              color="black"
              className="mr-2"
            />
            <Text>{isPlaying ? "Stop Audio" : "Play Audio"}</Text>
          </TouchableOpacity>
        )}

        <View className="w-full flex-row justify-between items-center">
          <Text className="text-gray-500 text-xs">
            {format(new Date(dream.date), "dd MMM yyyy")}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleFavoriteDream(dream.id)}
          >
            <MaterialCommunityIcons
              name={dream.favorite ? "heart" : "heart-broken"}
              size={20}
              color={
                (dream.favorite ? tailwindColors.rose : tailwindColors.neutral)[
                  colorScheme === "dark" ? 700 : 600
                ]
              }
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="absolute rounded-full size-8 items-center justify-center top-1.5 right-1"
          onPress={handleMenuPress}
        >
          <Entypo
            name="dots-three-vertical"
            size={16}
            color={
              colorScheme === "dark"
                ? tailwindColors.slate[200]
                : tailwindColors.slate[600]
            }
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
        animationType="fade"
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
          onPress={() => setMenuVisible(false)}
        >
          <View
            style={{
              position: "absolute",
              top: menuPosition.top,
              right: menuPosition.right,
              backgroundColor: "white",
              borderRadius: 8,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              width: 128,
            }}
          >
            <TouchableOpacity
              className="flex-row items-center px-3 py-2.5 border-b border-gray-200"
              onPress={handleEdit}
            >
              <Ionicons
                name="pencil"
                size={18}
                color={tailwindColors.neutral[600]}
                style={{ marginRight: 8 }}
              />
              <Text className="text-sm text-gray-700 font-geist-semibold">
                Edit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center px-3 py-2.5"
              onPress={handleDelete}
            >
              <Ionicons
                name="trash"
                size={18}
                color={tailwindColors.red[500]}
                style={{ marginRight: 8 }}
              />
              <Text className="text-sm font-geist-semibold text-red-500">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <CustomModal
        isVisible={!!confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Atenção"
        description="Essa ação é irreversível, deseja mesmo continuar?"
        icon="moon"
      >
        <View className="gap-2 flex-row justify-end w-full">
          <Button
            text="Voltar"
            variant={"ghost"}
            className="bg-slate-200/30 dark:bg-slate-700/20"
            onPress={() => {
              setConfirmModal(false);
            }}
          />

          <Button
            text="Deletar"
            variant={"destructive"}
            onPress={() => {
              deleteDream(dream.id);
              setConfirmModal(false);
            }}
          />
        </View>
      </CustomModal>
    </>
  );
};
