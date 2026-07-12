/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ["'Assistant'", 'system-ui', 'sans-serif'],
        display: ["'Secular One'", "'Assistant'", 'sans-serif'],
      },
    },
  },
  plugins: [],
};
