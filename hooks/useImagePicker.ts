import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

interface useImagePickerProps {
  maxImages: number;
}

export function useImagePicker({ maxImages }: useImagePickerProps) {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    if (!maxImages && images.length >= maxImages) {
      Alert.alert(
        "Limit reached",
        `You can only upload up to ${maxImages} images`
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
        selectionLimit: maxImages - images.length,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        setImages([...images, ...newImages].slice(0, maxImages));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error("Error picking image:", error);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImages([]);
  };

  return {
    images,
    pickImage,
    removeImage,
    clearImages,
    hasMaxImages: images.length >= maxImages,
    setImages
  };
}
