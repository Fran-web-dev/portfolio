/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        primary: "#000000",
        secondary: "#0a0a0a",
        text: "#ffffff",
        textMuted: "#a1a1aa",
        accent: "#0070f3",
        "accent-hover": "#0051cc",
        border: "#1f1f1f",
        "card-bg": "#111111",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        Montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
