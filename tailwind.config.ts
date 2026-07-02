import type { Config } from "tailwindcss";

/** Colors are driven by CSS variables (RGB triplets) so light/dark both work
 *  while keeping Tailwind opacity utilities like `bg-surface/60`. */
function v(name: string) {
  return `rgb(var(${name}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("--bg"),
        surface: v("--surface"),
        elevated: v("--elevated"),
        border: v("--border"),
        muted: v("--muted"),
        fg: v("--fg"),
        "fg-soft": v("--fg-soft"),
        accent: {
          DEFAULT: "#8b5cf6",
          soft: "#a78bfa",
        },
        easy: "#22c55e",
        medium: "#f59e0b",
        hard: "#f43f5e",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      maxWidth: { content: "72rem" },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out both",
        "scale-in": "scale-in 0.15s ease-out both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
