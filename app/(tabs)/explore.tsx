import { Heading } from "@/components/atoms/Heading";
import { DreamListItem } from "@/components/molecules/DreamListItem";
import { Dream } from "@/db/schema";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useDreams } from "@/hooks/useDreams";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabTwoScreen() {
  const { dreams, setPage, loading, deleteDream, refreshDreams } = useDreams();
  const { playSound } = useAudioRecorder();

  const router = useRouter();

  const groupDreamsByMonth: Record<string, Dream[]> = dreams.reduce(
    (acc: Record<string, Dream[]>, item) => {
      const month = format(new Date(item.date), "MMMM");

      return {
        ...acc,
        [month]: [...(acc[month] || []), item],
      };
    },
    {}
  );

  return (
    <View className={"flex-1 bg-white dark:bg-slate-950 pt-12"}>
      <StatusBar style="auto" />

      <Heading text="Recent Dreams" />

      <SectionList
        sections={Object.entries(groupDreamsByMonth).map(([key, value]) => ({
          title: key,
          data: value,
        }))}
        className="px-4"
        onEndReached={() => setPage((old) => old + 1)}
        stickySectionHeadersEnabled={true}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshDreams}
            colors={["#4285F4"]}
            tintColor="#4285F4"
          />
        }
        renderSectionHeader={({ section: { title } }) => (
          <View className="flex-row items-center bg-white py-4 dark:bg-slate-950">
            <Text className="font-faculty text-2xl mr-4 text-slate-800 dark:text-slate-200">
              {title}
            </Text>
            <View className="flex-1 h-px bg-slate-500 dark:text-slate-200" />
          </View>
        )}
        renderItem={DreamListItem}
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
