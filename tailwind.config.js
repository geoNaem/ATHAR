/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'oklch(32% 0.08 195)', // Deep Teal
        accent: 'oklch(72% 0.18 65)',   // Saffron
        background: 'oklch(97% 0.01 195)', // Surface
        dark: 'oklch(22% 0.03 250)', // Slate Ink
        surface: 'oklch(100% 0 0)', // Pure white for trust section
        border: 'oklch(88% 0.02 200)',
        muted: 'oklch(55% 0.03 220)'
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        arabic: ['"Noto Naskh Arabic"', 'serif']
      },
      fontSize: {
        'hero-heading': 'clamp(2.8rem, 5vw, 4.8rem)',
        'hero-arabic': 'clamp(3.92rem, 7vw, 6.72rem)', // 1.4x English
        'h2': 'clamp(1.8rem, 3vw, 2.8rem)',
        'h3': 'clamp(1.2rem, 2vw, 1.6rem)',
        'body-fluid': 'clamp(1rem, 1.5vw, 1.125rem)',
        'caption': '0.875rem',
        'label': '0.75rem',
      },
      lineHeight: {
        'relaxed': '1.72'
      },
      letterSpacing: {
        'widest': '0.08em',
      }
    },
  },
  plugins: [],
}
