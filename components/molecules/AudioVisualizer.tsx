import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

interface AudioVisualizerProps {
  isRecording: boolean;
  meterLevel: number;
}

const NUM_BARS = 12;
const MIN_BAR_HEIGHT = 6;
const MAX_BAR_HEIGHT = 60;
const WAVE_FREQUENCY = 1.5;
const WAVE_SPEED = 0.1;

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  meterLevel,
}) => {
  const bars = useRef(
    Array.from({ length: NUM_BARS }, () => new Animated.Value(MIN_BAR_HEIGHT))
  ).current;

  const lastMeterLevel = useRef(meterLevel);
  const animationFrameId = useRef<number | null>(null);
  const waveOffset = useRef(0);

  useEffect(() => {
    if (isRecording) {
      const animate = () => {
        waveOffset.current += WAVE_SPEED;
        if (waveOffset.current > Math.PI * 2) {
          waveOffset.current = 0;
        }

        bars.forEach((bar, index) => {
          const baseVariance = Math.random();

          // Calculate wave influence
          const waveInfluence = Math.sin(
            (index / NUM_BARS) * Math.PI * 2 * WAVE_FREQUENCY +
              waveOffset.current
          );

          // Blend random and wave movement based on meter level
          const blendedVariance =
            baseVariance * (1 - meterLevel) +
            (waveInfluence * 0.5 + 0.5) * meterLevel;

          // Scale to full MAX_BAR_HEIGHT range
          const scaledHeight =
            MIN_BAR_HEIGHT +
            blendedVariance * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT);

          // Apply meter level to determine final height
          const targetHeight =
            MIN_BAR_HEIGHT +
            (scaledHeight - MIN_BAR_HEIGHT) * Math.max(meterLevel - 0.3, 0) * 2;

          Animated.sequence([
            Animated.timing(bar, {
              toValue: Math.min(
                MAX_BAR_HEIGHT,
                Math.max(MIN_BAR_HEIGHT, targetHeight)
              ),
              duration: 100,
              useNativeDriver: false,
            }),
            Animated.timing(bar, {
              toValue: Math.min(
                MAX_BAR_HEIGHT,
                Math.max(MIN_BAR_HEIGHT, targetHeight * 0.7)
              ),
              duration: 100,
              useNativeDriver: false,
            }),
          ]).start();
        });

        animationFrameId.current = requestAnimationFrame(animate);
      };

      animate();
      lastMeterLevel.current = meterLevel;
    } else {
      bars.forEach((bar) => {
        Animated.timing(bar, {
          toValue: MIN_BAR_HEIGHT,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    }

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [isRecording, meterLevel, bars]);

  return (
    <View
      style={{
        height: MAX_BAR_HEIGHT * 1.2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
      }}
    >
      {bars.map((bar, index) => (
        <Animated.View
          key={index}
          style={{
            width: 4,
            marginHorizontal: 2,
            height: bar,
            backgroundColor: isRecording
              ? `rgba(59, 130, 246, ${Math.min(1, meterLevel + 0.4)})`
              : "#93C5FD",
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
};
