/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(37, 99, 235, 0.12)",
        card: "0 8px 32px -8px rgba(15, 23, 42, 0.1)",
        glow: "0 8px 32px -4px rgba(37, 99, 235, 0.45)",
        "glow-heart": "0 0 60px rgba(59, 130, 246, 0.35), inset 0 0 30px rgba(59, 130, 246, 0.1)",
      },
    },
  },
  plugins: [],
};
