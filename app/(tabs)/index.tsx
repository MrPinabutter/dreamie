// App.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<
    {
      id: number;
      title: string;
      content: string;
      timestamp: string;
    }[]
  >([]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "Please fill in both title and content");
      return;
    }

    const newPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      timestamp: new Date().toLocaleString(),
    };

    setPosts([newPost, ...posts]);
    setTitle("");
    setContent("");
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

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg items-center"
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-base">
            Upload
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <Text className="text-xl font-bold mb-4">Recent Posts</Text>

        {posts.map((post) => (
          <View key={post.id} className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="text-lg font-bold mb-2">
              {post.title}
            </Text>
            <Text className="text-base mb-2">{post.content}</Text>
            <Text className="text-gray-500 text-xs">
              {post.timestamp}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
