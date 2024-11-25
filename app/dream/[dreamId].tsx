import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { Input } from "@/components/atoms/Input";
import { AudioVisualizer } from "@/components/molecules/AudioVisualizer";
import { ImagePreviewer } from "@/components/molecules/ImagePreviewer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useDreams } from "@/hooks/useDreams";
import { useImagePicker } from "@/hooks/useImagePicker";
import { tailwindColors } from "@/utils";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import "react-native-get-random-values";

export default function App() {
  const { dreamId } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { updateDream, loadDream } = useDreams();
  const { colorScheme } = useColorScheme();
  const { images, pickImage, removeImage, clearImages, setImages } =
    useImagePicker({
      maxImages: 4,
    });

  const {
    audioUri,
    setAudioUri,
    isRecording,
    meterLevel,
    startRecording,
    stopRecording,
    playSound,
    clearAudio,
  } = useAudioRecorder();

  const handleSubmit = async () => {
    if (!title || !content) {
      Alert.alert("Preencha os campos");
      return;
    }

    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    try {
      await updateDream(dreamId as string, {
        title: title.trim(),
        description: content.trim(),
        date: new Date().toISOString(),
        images: JSON.stringify(images),
        audioUrl: audioUri ?? undefined,
        mood: undefined,
      });

      setTitle("");
      setContent("");
      clearImages();
      clearAudio();
      Alert.alert("Success", "Your dream has been updated!");
      router.back();
    } catch {
      Alert.alert("Error", "Failed to update your dream");
    }
  };

  useEffect(() => {
    (async () => {
      const data = await loadDream(dreamId as string);
      setTitle(data.title ?? "");
      setContent(data.description);
      setImages(JSON.parse(data.images ?? "[]"));
      setAudioUri(data.audioUrl);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-slate-950 px-4 pt-12"
    >
      <StatusBar style="auto" />

      <View className="h-full">
        <ScrollView
          contentContainerClassName="pb-4 gap-4 flex-1"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row gap-4">
            <FontAwesome
              onPress={router.back}
              name="arrow-left"
              size={24}
              color={tailwindColors.slate[colorScheme === "dark" ? 50 : 950]}
            />
            <Heading text="Update Dream" />
          </View>

          <Input
            placeholder="Enter title"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <Input
            className="flex-1"
            containerClassName="min-h-[200px] flex-1"
            placeholder="Enter your dream here"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          {/* Image Preview Section */}
          {images.length ? (
            <ImagePreviewer handleRemove={removeImage} images={images} />
          ) : null}

          {/* Media Buttons */}
          <View className="flex-row justify-between">
            <Button
              variant="secondary"
              onPress={pickImage}
              icon="images"
              text={`Add Images (${images.length}/4)`}
            />

            <Button
              variant={isRecording ? "destructive" : "secondary"}
              onPress={isRecording ? stopRecording : startRecording}
              icon={isRecording ? "stop" : "mic"}
              text={isRecording ? "Stop Recording" : "Record Audio"}
            />
          </View>

          {isRecording && (
            <AudioVisualizer
              isRecording={isRecording}
              meterLevel={meterLevel}
            />
          )}

          {audioUri && (
            <Button
              variant={"ghost"}
              onPress={() => playSound(audioUri)}
              icon={"play"}
              text={"Play Recorded Audio"}
              className="bg-slate-800"
            />
          )}

          <Button
            text="Update Dream"
            onPress={handleSubmit}
            disabled={!content && !title}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
