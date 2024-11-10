import { useState, useEffect } from 'react';
import { Audio } from "expo-av";
import { Alert, Platform } from 'react-native';

export function useAudioRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Sorry, we need audio permissions to make this work!"
          );
        }
      }
    })();
  }, []);

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
      Alert.alert("Failed to start recording", err as string);
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
      Alert.alert("Failed to stop recording", err as string);
    }
  };

  const playSound = async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();
    } catch (err) {
      Alert.alert("Failed to play sound", err as string);
    }
  };

  const clearAudio = () => {
    setAudioUri(null);
  };

  return {
    audioUri,
    isRecording,
    startRecording,
    stopRecording,
    playSound,
    clearAudio,
  };
}