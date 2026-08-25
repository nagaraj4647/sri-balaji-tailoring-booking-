import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          950: "#27070C",
          900: "#380B12",
          800: "#4A0E17",
          700: "#5D131F",
          600: "#741928",
          500: "#8B1E31",
          400: "#A82B42",
          100: "#F9E8EB",
          50: "#FDF5F6",
        },
        cream: {
          50: "#FAF7F2",
          100: "#F4EFE6",
          200: "#EAE2D5",
          300: "#DDD0BD",
          400: "#CBB9A0",
          900: "#2D2821",
        },
        gold: {
          300: "#F3DB8B",
          400: "#E5C158",
          500: "#D4AF37",
          600: "#C5A059",
          700: "#A6823C",
          800: "#7F6229",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-[#D4AF37], linear-gradient(135deg, #F3DB8B 0%, #D4AF37 50%, #A6823C 100%)",
        "maroon-gradient": "linear-gradient(135deg, #4A0E17 0%, #27070C 100%)",
        "cream-gradient": "linear-gradient(180deg, #FAF7F2 0%, #F4EFE6 100%)",
      },
      boxShadow: {
        luxury: "0 10px 30px -5px rgba(56, 11, 18, 0.12), 0 4px 12px rgba(212, 175, 55, 0.08)",
        "gold-glow": "0 0 20px rgba(212, 175, 55, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
