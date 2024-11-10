// App.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

interface Post {
  id: number;
  title: string;
  content: string;
  timestamp: string;
  images: string[];
  audioUri?: string;
}

export default function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: audioStatus } = await Audio.requestPermissionsAsync();
        
        if (imageStatus !== 'granted' || audioStatus !== 'granted') {
          Alert.alert('Permission needed', 'Sorry, we need camera roll and audio permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert("Limit reached", "You can only upload up to 4 images");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 4 - images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages([...images, ...newImages].slice(0, 4));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Failed to start recording', err as string);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setIsRecording(false);
      if (uri) setAudioUri(uri);
    } catch (err) {
      Alert.alert('Failed to stop recording', err as string);
    }
  };

  const playSound = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch (err) {
      Alert.alert('Failed to play sound', err as string);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      timestamp: new Date().toLocaleString(),
      images: [...images],
      audioUri: audioUri || undefined,
    };

    setPosts([newPost, ...posts]);
    setTitle("");
    setContent("");
    setImages([]);
    setAudioUri(null);
    Alert.alert("Success", "Your post has been uploaded!");
  };

  return (
    <View className="flex-1 bg-white px-4 pt-12">
      <StatusBar style="auto" />

      <View className="mb-6">
        <Text className="text-2xl font-bold mb-6 text-center">
          Create New Post
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
          placeholder="Enter your text here"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        {/* Image Preview Section */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {images.map((uri, index) => (
            <View key={index} className="relative">
              <Image
                source={{ uri }}
                className="w-20 h-20 rounded-lg"
              />
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
          <Text className="text-white font-bold text-base">Upload</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <Text className="text-xl font-bold mb-4">Recent Posts</Text>

        {posts.map((post) => (
          <View key={post.id} className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="text-lg font-bold mb-2">{post.title}</Text>
            <Text className="text-base mb-2">{post.content}</Text>
            
            {post.images.length > 0 && (
              <ScrollView horizontal className="mb-2">
                {post.images.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    className="w-20 h-20 rounded-lg mr-2"
                  />
                ))}
              </ScrollView>
            )}
            
            {post.audioUri && (
              <TouchableOpacity
                className="bg-gray-200 p-2 rounded-lg flex-row items-center justify-center mb-2"
                onPress={() => playSound(post.audioUri!)}
              >
                <Ionicons name="play" size={16} color="black" className="mr-2" />
                <Text>Play Audio</Text>
              </TouchableOpacity>
            )}
            
            <Text className="text-gray-500 text-xs">{post.timestamp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}