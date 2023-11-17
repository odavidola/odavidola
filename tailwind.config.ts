import type {Config} from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      width: {
        '125': '125px', // Add a custom width of 110px
      },
      fontsize: {
        nine: '9px'
      },
      fontFamily: {
        sans: ['Graphik'],
      },
      filter: 'contrast(310%) brightness(150%)',
      backgroundImage: {
        noise: "url('../public/dark.png')",
      },
    }
  },
  plugins: [],
}
export default config