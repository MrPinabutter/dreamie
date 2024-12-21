import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { Input } from "@/components/atoms/Input";
import { AudioVisualizer } from "@/components/molecules/AudioVisualizer";
import { DreamDatePicker } from "@/components/molecules/DatePicker";
import { ImagePreviewer } from "@/components/molecules/ImagePreviewer";
import { CustomModal } from "@/components/molecules/Modal";
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
  const [dreamDate, setDreamDate] = useState(new Date());

  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const { updateDream, loadDream } = useDreams();
  const { colorScheme } = useColorScheme();
  const { images, pickImage, removeImage, clearImages, setImages } =
    useImagePicker({
      maxImages: 4,
    });

  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  const {
    audioUri,
    setAudioUri,
    isRecording,
    meterLevel,
    startRecording,
    stopRecording,
    toggleSound,
    isPlaying,
    clearAudio,
  } = useAudioRecorder();

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please fill content");
      return;
    }

    try {
      await updateDream(dreamId as string, {
        title: title.trim(),
        description: content.trim(),
        date: dreamDate.toISOString(),
        images: JSON.stringify(images),
        audioUrl: audioUri ?? undefined,
        mood: undefined,
      });

      setTitle("");
      setContent("");
      clearImages();
      clearAudio();
      setSuccessModalOpen(true);
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
      setDreamDate(new Date(data.date));
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

            <Heading text="Update Dream" className="mr-auto" />
            <DreamDatePicker date={dreamDate} onDateChange={setDreamDate} />
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

          {/* Media Buttons */}
          <View className="flex-row justify-end gap-2">
            <Button
              variant="ghost"
              onPress={pickImage}
              icon="images"
              rounded
              className="dark:bg-slate-900 bg-slate-50 p-4"
            />

            <Button
              variant={isRecording ? "destructive" : "ghost"}
              onPress={isRecording ? stopRecording : startRecording}
              icon={isRecording ? "stop" : "mic"}
              rounded
              className="dark:bg-slate-900 bg-slate-50 p-4"
            />
          </View>

          {/* Image Preview Section */}
          {images.length ? (
            <ImagePreviewer handleRemove={removeImage} images={images} />
          ) : null}

          {isRecording && (
            <AudioVisualizer
              isRecording={isRecording}
              meterLevel={meterLevel}
            />
          )}

          {audioUri && (
            <Button
              variant={"ghost"}
              onPress={() => toggleSound(audioUri)}
              icon={isPlaying ? "stop" : "play"}
              text={isPlaying ? "Stop Audio" : "Play Recorded Audio"}
              className="dark:bg-slate-800 bg-slate-100"
            />
          )}

          <Button
            text="Update Dream"
            onPress={handleSubmit}
            disabled={!content && !title}
          />
        </ScrollView>
      </View>

      <CustomModal
        isVisible={successModalOpen}
        onClose={closeSuccessModal}
        title="Sucesso!"
        description="Seu sonho foi editado com sucesso!"
        icon="moon"
      >
        <Button
          text="Fechar"
          variant={"ghost"}
          className="bg-slate-200/30 dark:bg-slate-700/20"
          onPress={() => {
            closeSuccessModal();
            router.push("/(tabs)/explore");
          }}
        />
      </CustomModal>
    </KeyboardAvoidingView>
  );
}
