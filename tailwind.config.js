/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BFEAFD",
          300: "#93D8FB",
          400: "#63C2F6",
          500: "#004AAD",
          600: "#003A8C",
          700: "#002A6B",
        },
      },
    },
  },
  plugins: [],
};
