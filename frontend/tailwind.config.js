/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,jsx}",
    "node_modules/flowbite-react/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#121212',
          secondary: '#171717'
        },
        light: {
          primary: "hsl(0deg 0% 100% / 77%)",
          secondary: "hsl(0deg 0% 100% / 60%)"
        }
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
  ],
  darkMode: 'class',
}
