/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight-blue': 'rgb(2, 6, 23)', // slate-950
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
