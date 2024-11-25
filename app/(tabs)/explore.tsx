import { Heading } from "@/components/atoms/Heading";
import { Loader } from "@/components/atoms/Loader";
import { DreamListItem } from "@/components/molecules/DreamListItem";
import { Dream } from "@/db/schema";
import { useDreams } from "@/hooks/useDreams";
import { format } from "date-fns";
import { StatusBar } from "expo-status-bar";
import {
  RefreshControl,
  SectionList,
  Text,
  View,
} from "react-native";

export default function TabTwoScreen() {
  const { dreams, setPage, loading, refreshDreams } = useDreams();

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
        ListFooterComponent={<Loader isLoading={loading} />}
      />
    </View>
  );
}
