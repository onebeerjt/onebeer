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
        "vice-pink": "#ff2a6d",
        "vice-magenta": "#ff6ec7",
        "vice-purple": "#b026ff",
        "vice-teal": "#05d9e8",
        "vice-orange": "#ff9e3d",
        "vice-night": "#12061f"
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
