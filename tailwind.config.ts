import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        glow: {
          pink: "#ffb6b9",
          peach: "#fae3d9",
          mint: "#bbded6",
          bg: "#fafafa",
          ink: "#3b3447",
          muted: "#7a7286",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(255, 182, 185, 0.55)",
        lift: "0 18px 40px -16px rgba(59, 52, 71, 0.25)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(0.6)" },
          "50%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
