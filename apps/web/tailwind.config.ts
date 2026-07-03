import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        background: "#05060d",
        surface: {
          DEFAULT: "#0b0e1a",
          muted: "#0f1324",
          raised: "#131834",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        // Brand accent (blue-violet / indigo)
        brand: {
          50: "#eef1ff",
          100: "#e0e6ff",
          200: "#c4cdff",
          300: "#9fabff",
          400: "#7b85ff",
          500: "#5b5ef5",
          600: "#4b46e8",
          700: "#3d37c9",
          800: "#332ea3",
          900: "#2c2a80",
        },
        // Risk semantic colors
        risk: {
          low: "#22c55e",
          medium: "#f59e0b",
          high: "#f43f5e",
          critical: "#ef4444",
          info: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #5b5ef5 0%, #7b85ff 50%, #9333ea 100%)",
        "text-gradient": "linear-gradient(120deg, #ffffff 0%, #c4cdff 45%, #9fabff 100%)",
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "44px 44px",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(91,94,245,0.45)",
        "glow-lg": "0 0 80px -10px rgba(91,94,245,0.5)",
        card: "0 8px 40px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
