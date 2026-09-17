/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        yowa: {
          cream: '#FBF6EC',
          panel: '#FFFFFF',
          ink: '#1E1912',
          inksoft: '#4A4139',
          yellow: '#F2B705',
          yellowsoft: '#FCE4A1',
          brown: '#6B4423',
          brownsoft: '#C9A177',
          green: '#3E7B4F',
          greensoft: '#B7D8C1'
        }
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};