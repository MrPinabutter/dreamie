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
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { Dream } from "@/db/schema";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useDreams } from "@/hooks/useDreams";
import { tailwindColors } from "@/utils";
import { useColorScheme } from "nativewind";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const DreamListItem = ({ item: dream }: { item: Dream }) => {
  const { playSound } = useAudioRecorder();
  const { deleteDream } = useDreams();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const { colorScheme } = useColorScheme();

  const handleEdit = () => {
    setMenuVisible(false);
    router.navigate(`../dream/${dream.id}`);
  };

  const handleDelete = () => {
    setMenuVisible(false);
    deleteDream(dream.id);
  };

  const handleMenuPress = (event: any) => {
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
        className="bg-gray-50 p-4 rounded-lg mb-4 relative dark:bg-slate-800"
        activeOpacity={0.9}
        onPress={() => router.navigate(`../dream/${dream.id}`)}
      >
        {dream.title && (
          <Text className="text-xl font-geist-bold dark:text-slate-50">
            {dream.title}
          </Text>
        )}

        <Text className="text-base mb-2 font-crete dark:text-slate-300">
          {dream.description.slice(0, 200)}
          {dream.description.length > 200 && "..."}
        </Text>

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
            className="bg-gray-200 p-2 rounded-lg flex-row items-center justify-center mb-2"
            onPress={() => playSound(dream.audioUrl!)}
          >
            <Ionicons name="play" size={16} color="black" className="mr-2" />
            <Text>Play Audio</Text>
          </TouchableOpacity>
        )}

        <Text className="text-gray-500 text-xs">
          {new Date(dream.date).toLocaleString()}
        </Text>

        <TouchableOpacity
          className="absolute rounded-full size-8 items-center justify-center top-2 right-2"
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
              <Text className="text-sm text-gray-700">Edit</Text>
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
              <Text className="text-sm text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};