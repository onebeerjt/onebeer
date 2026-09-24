import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f2eee4",
        ink: "#0a0a0a",
        graphite: "#56534b",
        bone: "#ece5d5",
        smoke: "#8a8478",
        ash: "#4a4640",
        marquee: "#f2c200",
        "holo-pink": "#ff4fd8",
        "holo-violet": "#8a5cff",
        "holo-cyan": "#3ff0ff",
        "holo-lime": "#c8ff3a",
        link: "#1a3fd6"
      },
      fontFamily: {
        fraktur: ["var(--font-fraktur)", "serif"],
        news: ["var(--font-news)", "Georgia", "serif"],
        pixel: ["var(--font-pixel)", "monospace"],
        criterion: ["var(--font-cormorant)", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};

export default config;
