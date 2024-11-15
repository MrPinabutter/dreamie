/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        crete: "CreteRound",
        "crete-italic": "CreteRoundItalic",
        faculty: "Faculty",
      },
    },
  },
  plugins: [],
};
