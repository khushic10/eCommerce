/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			colors: {
				"custom-brown": "#6c5a56",
				"custom-red": "#b78ea2",
				"custom-black": "#554f54",
				"custom-orange": "#ac8174",
				"custom-pink": "#d1bfcf",
				"custom-creme": "#e4dfdc",
				"custom-gray": "#eaecf1",
			},
		},
	},
	plugins: [],
};
