/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        plum: {
          50: "#f6eff5",
          100: "#ecdcea",
          200: "#d6b6d2",
          300: "#bb8cb7",
          400: "#9a6798",
          500: "#7a4c79",
          600: "#5f3860",
          700: "#4a2545",
          800: "#3a1c37",
          900: "#2e1f2d",
        },
        lavender: {
          50: "#f5f2fb",
          100: "#e9e2f5",
          200: "#d2c3ea",
          300: "#b7a2dc",
          400: "#9d87cd",
          500: "#8e7cc3",
          600: "#7563a8",
          700: "#5e4e89",
          800: "#4a3e6d",
          900: "#3a3157",
        },
        rose: {
          50: "#fbf1f2",
          100: "#f5e0e2",
          200: "#e9c0c4",
          300: "#d99fa6",
          400: "#c98b96",
          500: "#b9707e",
          600: "#9c5765",
          700: "#7d4451",
          800: "#5f3440",
          900: "#4a2832",
        },
        sage: {
          50: "#f3f6f0",
          100: "#e4ebdc",
          200: "#cbd9bc",
          300: "#aec49a",
          400: "#9caf88",
          500: "#829771",
          600: "#67795a",
          700: "#515f47",
          800: "#3f4a38",
          900: "#333c2e",
        },
        ivory: "#fbf8f3",
        charcoal: "#2e1f2d",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -15px rgba(74,37,69,0.25)",
        card: "0 8px 30px -10px rgba(74,37,69,0.18)",
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.6 },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
