import { Cormorant_Garamond, Newsreader, Silkscreen, UnifrakturMaguntia } from "next/font/google";

export const fraktur = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraktur"
});

export const news = Newsreader({
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
  variable: "--font-news"
});

export const pixel = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel"
});

export const cormorant = Cormorant_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant"
});
