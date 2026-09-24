import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        bone: "#ece5d5",
        smoke: "#8a8478",
        ash: "#4a4640",
        marquee: "#f2c200",
        blood: "#a3201c"
      },
      fontFamily: {
        chapter: ["var(--font-anton)", "Impact", "sans-serif"],
        criterion: ["var(--font-cormorant)", "Georgia", "serif"],
        script: ["var(--font-courier)", "Courier New", "monospace"],
        yeezy: ["\"Helvetica Neue\"", "Helvetica", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
