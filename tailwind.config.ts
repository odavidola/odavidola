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
      fontFamily: {
        sans: ['var(--font-graphik)'],
      },
      filter: 'contrast(310%) brightness(150%)',
      backgroundImage: {
        noise: "radial-gradient(circle at 20% 80%, rgba(0,0,0,0), rgba(0,0,0,1)), radial-gradient(circle at 109% 48%, rgba(0,0,0,1), rgba(255,255,0,0)),  url('../public/noise.svg')",
      },
    }
  },
  plugins: [],
}
export default config