/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx}',
    './src/content/**/*.{md,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa',
          500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95'
        },
        bgdark: '#0b0b10'
      },
      borderRadius: { xl2: '1.25rem' }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
