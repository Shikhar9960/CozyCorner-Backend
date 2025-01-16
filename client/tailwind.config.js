/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "rgb(33, 33, 33)",
        darkpink: "rgb(250, 133, 176)",
        pink: "rgb(255, 244, 252)",
        beige: "rgb(251, 245, 229)",
      },
    },
    plugins: [
      require('@tailwindcss/line-clamp'),
      // ...
    ],
  }}