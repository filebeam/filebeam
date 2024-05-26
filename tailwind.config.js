/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  future: {
    hoverOnlyWhenSupported: true
  },
  theme: {
    extend: {
      screens: {
        'h\-sm': { 'raw': '(min-height: 470px)' },
        'h\-md': { 'raw': '(min-height: 600px)' },
      },
    },
    colors: {
      gray: {
        '50': "	#f1f2f4",
        '100': "#e4e5e7",
        '200': "#cbccce",
        '300': "#a9aaab",
        '400': "#848486",
        '500': "#5f5f60",
        '600': "#3e3f3f",
        '700': "#242525",
        '800': "#131414",
        '900': "#0c0d0d",
      },
      blue: {
        '50': '#edf4fd',
        '100': '#dae9fb',
        '200': '#b5d2f7',
        '300': '#91bcf2',
        '400': '#6ca5ee',
        '500': '#478fea',
        '600': '#3972bb',
        '700': '#2b568c',
        '800': '#1c395e',
        '900': '#0e1d2f'
      },
      green: {
        '50': '#edfded',
        '100': '#dbfbda',
        '200': '#b8f7b5',
        '300': '#94f390',
        '400': '#71ef6b',
        '500': '#4deb46',
        '600': '#3ebc38',
        '700': '#2e8d2a',
        '800': '#1f5e1c',
        '900': '#0f2f0e'
      },
      yellow: {
        '50': '#fdfbed',
        '100': '#fbf6da',
        '200': '#f7eeb5',
        '300': '#f3e590',
        '400': '#efdd6b',
        '500': '#ebd446',
        '600': '#bcaa38',
        '700': '#8d7f2a',
        '800': '#5e551c',
        '900': '#2f2a0e'
      },
      red: {
        '50': '#fdeded',
        '100': '#fbdada',
        '200': '#f7b5b5',
        '300': '#f39090',
        '400': '#ef6b6b',
        '500': '#eb4646',
        '600': '#bc3838',
        '700': '#8d2a2a',
        '800': '#5e1c1c',
        '900': '#2f0e0e'
      },
      inherit: 'inherit',
      current: 'currentColor',
      transparent: 'transparent',
    },
  },
  plugins: [],
};