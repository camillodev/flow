/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        calm: 'hsl(var(--color-calm))',
        focus: 'hsl(var(--color-focus))',
        connect: 'hsl(var(--color-connect))',
        recover: 'hsl(var(--color-recover))',
      },
    },
  },
  plugins: [],
}
