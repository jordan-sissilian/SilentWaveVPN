module.exports = {
  prefix: "tw-",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#213851',
        'blue-fn': '#0a2540',
        'blue-cl': "rgba(0, 55, 122, 0.9)",
        'blue-link': "rgb(0, 212, 255)",
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      'plg': { min: '1025px' },
      'pxlg': { min: '1481px' },
    },
  },
  plugins: [],
};
