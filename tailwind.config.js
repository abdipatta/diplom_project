/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      sm: "478px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      orange: "#F37216",
      "light-orange": "#fde5d3",
      "dark-orange": "#c25b12",
      white: "#FFFFFF",
      black: "#222",
    },
  },
  plugins: [],
};
