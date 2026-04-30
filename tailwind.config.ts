import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1F7A63",
          50: "#E6F4F1",
          200: "#A7D6C9",
          300: "#66B5A0",
          400: "#3A9B7F",
          700: "#17614F",
          800: "#124C3E",
          900: "#0D382E",
          950: "#08241F",
        },
        neutral: {
          text: "#1F2937",
          muted: "#6B7280",
          border: "#D1D5DB",
          bg: "#F5F7F6",
          card: "#FFFFFF",
        },
        gold: "#C9A227",
        info: "#2D6CDF",
        success: "#22C55E",
        danger: "#EF4444",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        arabic: ["Noto Sans Arabic", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
