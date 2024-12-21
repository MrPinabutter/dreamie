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
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { nanoid } from "nanoid";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import "react-native-get-random-values";

export default function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dreamDate, setDreamDate] = useState(new Date());
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const { addDream } = useDreams();
  const { images, pickImage, removeImage, clearImages } = useImagePicker({
    maxImages: 4,
  });
  const {
    audioUri,
    isRecording,
    meterLevel,
    startRecording,
    stopRecording,
    toggleSound,
    clearAudio,
    isPlaying,
  } = useAudioRecorder();

  const handleSubmit = async () => {
    try {
      await addDream({
        id: nanoid(),
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
    } catch {
      Alert.alert("Error", "Failed to save your dream");
    }
  };

  const closeSuccessModal = () => {
    setSuccessModalOpen(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white pt-12 dark:bg-slate-950 px-4"
    >
      <StatusBar style="auto" />

      <View className="flex-row justify-between items-center">
        <Heading text="Create Dream" />
        <DreamDatePicker date={dreamDate} onDateChange={setDreamDate} />
      </View>

      <ScrollView
        contentContainerClassName="flex-1 pb-4 gap-4 mt-2"
        keyboardShouldPersistTaps="handled"
      >
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
          <AudioVisualizer isRecording={isRecording} meterLevel={meterLevel} />
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
          text="Save Dream"
          onPress={handleSubmit}
          disabled={!content && !title}
        />
      </ScrollView>

      <CustomModal
        isVisible={successModalOpen}
        onClose={closeSuccessModal}
        title="Sucesso!"
        description="Seu sonho foi salvo com sucesso!"
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
