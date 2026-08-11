/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        "deep-space": "#0a0a1a",
        "starry-gold": "#d4af37",
        "moon-silver": "#c0c0d0",
        "mystic-purple": "#9b59b6",
      },
      boxShadow: {
        glass: "0 18px 60px rgba(8, 8, 24, 0.38)",
        gold: "0 0 24px rgba(212, 175, 55, 0.24)",
        mystic: "0 0 28px rgba(155, 89, 182, 0.24)",
      },
      backgroundImage: {
        "cosmic-panel":
          "linear-gradient(135deg, rgba(17, 16, 44, 0.82), rgba(34, 22, 61, 0.42))",
      },
      animation: {
        "soft-pulse": "softPulse 4s ease-in-out infinite",
      },
      keyframes: {
        softPulse: {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
