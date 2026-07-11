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
        nuria: {
          DEFAULT: "#009493",
          dark: "#006F6E",
          soft: "#E6F5F5",
          rose: "#FFB6A6",
          "rose-soft": "#FFF1ED",
          bg: "#F7FBFB",
          ink: "#10212A",
          footer: "#063B3A",
        },
        /* Remapped to NURIA greens for legacy class compatibility */
        medical: {
          50: "#E6F5F5",
          100: "#D0EDED",
          200: "#A8D9D8",
          300: "#6BBFBE",
          400: "#33A8A7",
          500: "#009493",
          600: "#009493",
          700: "#006F6E",
          800: "#055A59",
          900: "#063B3A",
          950: "#042928",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(0, 148, 147, 0.14)",
        card: "0 8px 32px -8px rgba(16, 33, 42, 0.1)",
        glow: "0 8px 32px -4px rgba(0, 148, 147, 0.4)",
        "glow-heart":
          "0 0 60px rgba(0, 148, 147, 0.3), inset 0 0 30px rgba(0, 148, 147, 0.08)",
      },
    },
  },
  plugins: [],
};
