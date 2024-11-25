import { View, ActivityIndicator } from "react-native";

export const Loader = ({ isLoading }: { isLoading: boolean }) => {
  return (
    isLoading && (
      <View className="w-full items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  );
};
