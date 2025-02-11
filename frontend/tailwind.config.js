/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        120: "30rem",
      },
      dropShadow: {
        "3xl": "0 35px 35px rgba(0, 0, 0, 0.25)",
        "4xl": ["0 35px 35px rgba(0, 0, 0, 0.25)", "0 45px 65px rgba(0, 0, 0, 0.15)"],
      },
      colors: {
        tempoGreen: "#526B45",
        heathergray: "#F5F3F3",
        lightgray: "#B7B4B4",
        darkgray: "#6B6A6A",
        beigebrown: "#C6AF95",
        beigegray: "#EBE9E6",
        tempoBlue: "#93BAC7",
        midnight: "#20306A",
        paper: "#fbfbf8",
        paperwhite: "#fbfbff",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
