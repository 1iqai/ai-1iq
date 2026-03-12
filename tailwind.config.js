/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
      },
      fontSize: {
        // xs: ['0.75rem', { lineHeight: '1rem' }],
        // sm: ['0.875rem', { lineHeight: '1.25rem' }],
        // m: ['1rem', { lineHeight: '1.5rem' }],
      },
    },
    plugins: [],
  }
}