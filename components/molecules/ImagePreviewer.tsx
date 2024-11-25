import { Ionicons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";

interface ImagePreviewerProps {
  images: string[];
  handleRemove: (idx: number) => void;
}

export const ImagePreviewer = ({
  images,
  handleRemove,
}: ImagePreviewerProps) => {
  return (
    <View className="flex-row flex-wrap gap-2">
      {images.map((uri, index) => (
        <View key={uri} className="relative">
          <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
          <TouchableOpacity
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            onPress={() => handleRemove(index)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={12} color="white" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};
