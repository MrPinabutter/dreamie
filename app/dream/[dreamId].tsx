import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useDreams } from "@/hooks/useDreams";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import AudioVisualizer from "@/components/AudioVisualizer";
import { useLocalSearchParams } from "expo-router";

export default function App() {
  const { dreamId } = useLocalSearchParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { updateDream, loadDream } = useDreams();

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
    } catch (error) {
      console.error("Error saving dream:", error);
      Alert.alert("Error", "Failed to update your dream");
    }
  };

  useEffect(() => {
    (async () => {
      const data = await loadDream(dreamId as string);
      setTitle(data.title);
      setContent(data.description);
      setImages(JSON.parse(data.images ?? "[]"));
      setAudioUri(data.audioUrl);
    })();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white pt-4"
    >
      <StatusBar style="auto" />

      <Text className="text-3xl mb-4 font-geist-black px-4">Update Dream</Text>

      <ScrollView
        contentContainerClassName="flex-1 pb-4 px-4"
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          className="border border-gray-200 rounded-lg p-3 mb-4 text-base font-crete"
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        <TextInput
          className="border border-gray-200 rounded-lg p-3 mb-4 text-base font-crete min-h-[200px] flex-1"
          placeholder="Enter your dream here"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
        {/* Image Preview Section */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {images.map((uri, index) => (
            <View key={uri} className="relative">
              <Image source={{ uri }} className="w-20 h-20 rounded-lg" />
              <TouchableOpacity
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close" size={12} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* Media Buttons */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            className="bg-gray-200 p-3 rounded-lg flex-row items-center"
            onPress={pickImage}
          >
            <Ionicons name="images" size={20} color="black" className="mr-2" />
            <Text className="font-geist-medium">
              Add Images ({images.length}/4)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`p-3 rounded-lg flex-row items-center ${
              isRecording ? "bg-red-500" : "bg-gray-200"
            }`}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={20}
              color={isRecording ? "white" : "black"}
              className="mr-2"
            />
            <Text
              className={`font-geist-medium ${
                isRecording ? "text-white" : "text-black"
              }`}
            >
              {isRecording ? "Stop Recording" : "Record Audio"}
            </Text>
          </TouchableOpacity>
        </View>
        <AudioVisualizer isRecording={isRecording} meterLevel={meterLevel} />

        {audioUri && (
          <TouchableOpacity
            className="bg-gray-100 p-3 rounded-lg flex-row items-center justify-center mb-4"
            onPress={() => playSound(audioUri)}
          >
            <Ionicons name="play" size={20} color="black" className="mr-2" />
            <Text>Play Recorded Audio</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg items-center"
          onPress={handleSubmit}
        >
          <Text className="text-white text-base font-geist-semibold">
            Update Dream
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}