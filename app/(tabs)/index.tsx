import "react-native-get-random-values";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { nanoid } from "nanoid";
import { useDreams } from "@/hooks/useDreams";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

export default function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { addDream } = useDreams();
  const { images, pickImage, removeImage, clearImages } = useImagePicker(4);
  const {
    audioUri,
    isRecording,
    startRecording,
    stopRecording,
    playSound,
    clearAudio,
  } = useAudioRecorder();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    try {
      await addDream({
        id: nanoid(),
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
      Alert.alert("Success", "Your dream has been saved!");
    } catch (error) {
      console.error("Error saving dream:", error);
      Alert.alert("Error", "Failed to save your dream");
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <StatusBar style="auto" />

      <View className="mb-6">
        <Text className="text-2xl font-bold mb-6 text-center">
          Create New Dream
        </Text>

        <TextInput
          className="border border-gray-200 rounded-lg p-3 mb-4 text-base"
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        <TextInput
          className="border border-gray-200 rounded-lg p-3 mb-4 h-36 text-base"
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
            <Text>Add Images ({images.length}/4)</Text>
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
            <Text className={isRecording ? "text-white" : "text-black"}>
              {isRecording ? "Stop Recording" : "Record Audio"}
            </Text>
          </TouchableOpacity>
        </View>

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
          <Text className="text-white font-bold text-base">Save Dream</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
