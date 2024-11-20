import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />

      <View className="flex-1 items-center justify-center p-5">
        <Text className="font-bold text-2xl">Erro 404</Text>
        <Text>Tela não encontrada!</Text>

        <Link href="/(tabs)" className="mt-4 py-4">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
