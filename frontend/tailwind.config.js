/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Solarpunk/Martian/Lunar Color Palette
        // Warm Martian tones
        martian: {
          50: '#fef7f3',
          100: '#fdeee6',
          200: '#fbd9cc',
          300: '#f7bca6',
          400: '#f2937a',
          500: '#e86a4f',
          600: '#d64d2e',
          700: '#b33d23',
          800: '#933420',
          900: '#79321f',
        },
        // Lunar silvers and cool tones
        lunar: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e4e8eb',
          300: '#d1d8dd',
          400: '#b8c2c9',
          500: '#9ca8b3',
          600: '#7d8a97',
          700: '#64707c',
          800: '#525c66',
          900: '#454d55',
        },
        // Solarpunk greens (growth, nature)
        solar: {
          50: '#f0f9f4',
          100: '#dcf2e3',
          200: '#bce4ca',
          300: '#8fcea8',
          400: '#5cb07f',
          500: '#3a9462',
          600: '#2a7650',
          700: '#235f42',
          800: '#1f4d37',
          900: '#1a402f',
        },
        // Dusty rose/terracotta accents
        terracotta: {
          50: '#fef5f3',
          100: '#fde8e4',
          200: '#fbd4cd',
          300: '#f7b5a9',
          400: '#f18d7a',
          500: '#e66b55',
          600: '#d34f36',
          700: '#b03e29',
          800: '#923526',
          900: '#7a3024',
        },
        // Soft sky blues (peaceful, serene)
        sky: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9deff',
          300: '#7cc4ff',
          400: '#36a5ff',
          500: '#0c8aff',
          600: '#006ce8',
          700: '#0055b5',
          800: '#054895',
          900: '#0a3f7a',
        },
        // Warm sunset oranges
        sunset: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Dark theme colors
        dark: {
          50: '#1a1a1a',
          100: '#1f1f1f',
          200: '#252525',
          300: '#2a2a2a',
          400: '#303030',
          500: '#353535',
          600: '#3a3a3a',
          700: '#404040',
          800: '#454545',
          900: '#4a4a4a',
        },
        // Vibrant accent blue (like in the image)
        accent: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80bfff',
          300: '#4da6ff',
          400: '#1a8cff',
          500: '#0073e6',
          600: '#005bb3',
          700: '#004280',
          800: '#002a4d',
          900: '#00111a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'organic': '1.5rem',
        'soft': '1rem',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
        'gentle': '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.4)',
        'glow-blue': '0 0 20px rgba(0, 115, 230, 0.3), 0 0 40px rgba(0, 115, 230, 0.1)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'gentle-pulse': 'gentlePulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gentlePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

