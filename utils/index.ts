
import tailwindConfig from "@/tailwind.config.js";
import resolveConfig from "tailwindcss/resolveConfig";

export const tailwindColors = resolveConfig(tailwindConfig).theme.colors;