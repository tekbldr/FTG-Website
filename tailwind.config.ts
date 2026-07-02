import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        "ink-2": "#0A0A0D",
        paper: "#FAFAF7",
        spark: "#FF5E2C",
        graphite: "#26262E",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arimo", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderColor: { DEFAULT: "rgba(250,250,247,0.09)" },
    },
  },
  plugins: [],
};
export default config;
