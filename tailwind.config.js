/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        goldCreamTheme: {
          "primary": "#D4AF37",    // Gold
          "secondary": "#F5F5DC",  // Cream
          "accent": "#B8860B",     // Dark Goldenrod
          "neutral": "#3D4451",
          "base-100": "#FFFDD0",   // Cream Base
          "base-200": "#F5F5DC",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
}