import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useDreams } from "@/hooks/useDreams";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabTwoScreen() {
  const { dreams, setPage, loading } = useDreams();
  const { playSound } = useAudioRecorder();

  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <StatusBar style="auto" />
      <Text className="text-xl font-bold mb-4">Recent Dreams</Text>
      <FlatList
        className="flex-1"
        data={dreams}
        onEndReached={() => setPage((old) => old + 1)}
        onEndReachedThreshold={0.1}
        renderItem={({ item: dream }) => (
          <View key={dream.id} className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="text-lg font-bold mb-2">{dream.title}</Text>
            <Text className="text-base mb-2">{dream.description}</Text>

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
                <Ionicons
                  name="play"
                  size={16}
                  color="black"
                  className="mr-2"
                />
                <Text>Play Audio</Text>
              </TouchableOpacity>
            )}

            <Text className="text-gray-500 text-xs">
              {new Date(dream.date).toLocaleString()}
            </Text>
          </View>
        )}
        ListFooterComponent={() =>
          loading && (
            <View className="w-full items-center justify-center">
              <ActivityIndicator />
            </View>
          )
        }
      />
    </View>
  );
}
