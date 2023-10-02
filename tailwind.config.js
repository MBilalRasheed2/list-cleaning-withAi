/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "sans-serif", "system-ui"]
			},
			colors: {
				transparent: "transparent",
				current: "currentColor",
				dark: "#171d1c",
				lightblue: "#5FBFF9",
				darkblue: "#5863F8",
				magnolia: "#EFE9F4",
				emerald: "#3DDC97"
			}
		}
	},
  plugins: [],
}
