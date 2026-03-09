import type { Config } from "tailwindcss";

const theme = {
  colors: {
    page: "#181921",
    primary: "#6D00FF",
    card: "#1D1E2B",
    chip: "rgba(0, 0, 0, 0.15)",
    accent: "#00FFA5",
    muted: "#E5E7EB",
    label: "#E6E0E9",
    "status-live": "#00FFA5",
    "status-finished": "#EE5E52",
    "card-yellow": "#E7D93F",
    "card-red": "#EE5E52",
    "border-subtle": "#292B41",
    "on-surface": "#FFFFFF",
    "on-accent": "#111827",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    badge: "12px",
    pill: "9999px",
  },
} as const;

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: theme.colors,
      borderRadius: theme.borderRadius,
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        poppins: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "border-slide": {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "border-slide": "border-slide 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
