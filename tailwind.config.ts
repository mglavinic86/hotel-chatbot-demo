import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hotel: {
          50: "#f4f8f5",
          100: "#e4efe8",
          300: "#a9c7b2",
          500: "#5c8a6a",
          600: "#4a7559",
          700: "#3a5f48",
          900: "#1f3628"
        }
      },
      boxShadow: {
        widget: "0 20px 45px -20px rgba(31,54,40,0.35)"
      }
    },
  },
  plugins: [],
};

export default config;
