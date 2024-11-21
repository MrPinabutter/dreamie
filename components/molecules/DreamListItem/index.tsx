import { Dream } from "@/db/schema";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useDreams } from "@/hooks/useDreams";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity } from "react-native";

export const DreamListItem = ({ item: dream }: { item: Dream }) => {
  const { playSound } = useAudioRecorder();
  const { deleteDream } = useDreams();

  return (
    <TouchableOpacity
      key={dream.id}
      className="bg-gray-50 p-4 rounded-lg mb-4 relative dark:bg-slate-800"
      activeOpacity={0.9}
      onPress={() => router.navigate(`../dream/${dream.id}`)}
    >
      <Text className="text-lg font-geist-bold dark:text-slate-50">
        {dream.title}
      </Text>
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
        className="absolute bg-red-500 rounded-full size-4 items-center justify-center top-2 right-2"
        onPress={() => deleteDream(dream.id)}
      >
        <Ionicons name="close" size={12} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
