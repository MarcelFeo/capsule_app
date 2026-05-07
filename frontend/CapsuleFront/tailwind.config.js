module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#DDECE0', // Verde Sálvia muito claro
          DEFAULT: '#739E82', // Verde Sálvia (Cor principal)
          dark: '#4D6B57', // Verde Musgo (Foco/Texto)
        },
        secondary: {
          DEFAULT: '#F4A261', // Coral Suave (Destaque/Alertas)
          light: '#FDEBD0',
        },
        neutral: {
          100: '#FAF9F6', // Off-white / Creme (Fundo principal)
          200: '#F2F0E9', // Bege claro (Cards/Inputs)
          300: '#E5E2D9', // Bordas e divisores
          800: '#2D312E', // Texto principal (Quase preto, mas suave)
          900: '#1A1C1B',
        },
        status: {
          success: '#739E82',
          warning: '#E9C46A',
          error: '#E76F51',
          info: '#457B9D',
        }
      },
    },
  },
  plugins: [],
};
