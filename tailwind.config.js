/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./(app|components)/**/*.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        crete: "CreteRound",
        shrikhand: "Shrikhand",
        climateCrisis: "ClimateCrisis",
        fascinate: "Fascinate",
        "crete-italic": "CreteRoundItalic",
        faculty: "Faculty",
        "geist-black": "Geist-Black",
        "geist-bold": "Geist-Bold",
        "geist-semibold": "Geist-SemiBold",
        "geist-medium": "Geist-Medium",
        "geist-regular": "Geist-Regular",
        "geist-light": "Geist-Light",
        "geist-thin": "Geist-Thin",
      },
    },
  },
  plugins: [],
};
