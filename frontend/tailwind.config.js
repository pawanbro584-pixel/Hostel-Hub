/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Deep Indigo
          dark: '#3730A3',
          light: '#EEF2FF'
        },
        accent: {
          DEFAULT: '#10B981', // Emerald Success
          light: '#ECFDF5'
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber
          light: '#FEF3C7'
        },
        danger: {
          DEFAULT: '#EF4444', // Rose Red
          light: '#FEF2F2'
        },
        background: '#F8FAFC', // Slate 50
        card: '#FFFFFF',
        text: {
          DEFAULT: '#0F172A', // Slate 900
          muted: '#64748B', // Slate 500
          light: '#94A3B8'
        },
        border: '#E2E8F0', // Slate 200
        input: '#F1F5F9'
      }
    }
  },
  darkMode: "class",
  plugins: []
};
