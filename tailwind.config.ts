import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        onlyvet: {
          navy: "#1E2B3C",
          teal: "#3FA7A3",
          coral: "#F7765C",
          bg: "#F9FAFB",
        },
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15,23,42,0.06)",
        card: "0 18px 40px rgba(15,23,42,0.03)",
        hero: "0 22px 60px rgba(15,23,42,0.7)",
      },
    },
  },
  plugins: [],
};

export default config;
