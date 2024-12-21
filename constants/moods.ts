import { AntDesign } from "@expo/vector-icons";
import { tailwindColors } from "@/utils";

export type MoodLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface MoodInfo {
  emoji: string;
  label: string;
  color: string;
  darkColor: string;
  icon: keyof typeof AntDesign.glyphMap;
  description: string;
}

export const MOODS: Record<MoodLevel, MoodInfo> = {
  0: {
    emoji: "😶",
    label: "Unknown",
    color: tailwindColors.slate[400],
    darkColor: tailwindColors.slate[500],
    icon: "questioncircle",
    description: "No mood recorded",
  },
  1: {
    emoji: "😢",
    label: "Very Negative",
    color: tailwindColors.red[500],
    darkColor: tailwindColors.red[600],
    icon: "frown",
    description: "Disturbing or unpleasant",
  },
  2: {
    emoji: "😕",
    label: "Negative",
    color: tailwindColors.orange[500],
    darkColor: tailwindColors.orange[600],
    icon: "meh",
    description: "Slightly uncomfortable",
  },
  3: {
    emoji: "😐",
    label: "Neutral",
    color: tailwindColors.yellow[500],
    darkColor: tailwindColors.yellow[600],
    icon: "meh",
    description: "Neither good nor bad",
  },
  4: {
    emoji: "😊",
    label: "Positive",
    color: tailwindColors.green[500],
    darkColor: tailwindColors.green[600],
    icon: "smile-circle",
    description: "Pleasant experience",
  },
  5: {
    emoji: "🤩",
    label: "Very Positive",
    color: tailwindColors.violet[500],
    darkColor: tailwindColors.violet[600],
    icon: "star",
    description: "Amazing experience",
  },
} as const;
