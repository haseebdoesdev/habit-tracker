/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // TODO: Customize your theme colors
      // WHY: Create a unique visual identity for your app
      // APPROACH: Add custom colors that match your brand
      colors: {
        // Example: Add your primary brand colors
        // primary: {
        //   50: '#f0f9ff',
        //   500: '#0ea5e9',
        //   900: '#0c4a6e',
        // }
      },
      // TODO: Add custom fonts if desired
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'],
      // }
    },
  },
  plugins: [],
}

