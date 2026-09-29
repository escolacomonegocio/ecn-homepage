import type { Config } from "tailwindcss";

// Cores como canais RGB para o modificador de opacidade (bg-ink/80) gerar CSS válido.
const c = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: c("ink"),
        "ink-2": c("ink-2"),
        "ink-3": c("ink-3"),
        paper: c("paper"),
        "paper-2": c("paper-2"),
        snow: c("snow"),
        mint: c("mint"),
        "mint-deep": c("mint-deep"),
        fog: c("fog"),
        slate: c("slate"),
      },
      fontFamily: { sans: ["var(--font-satoshi)", "system-ui", "sans-serif"] },
      maxWidth: { page: "1360px" },
      transitionTimingFunction: { out: "cubic-bezier(0.23, 1, 0.32, 1)" },
    },
  },
} satisfies Config;
