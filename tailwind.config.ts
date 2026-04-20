import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bd: {
          green: "#006A4E",
          "green-light": "#008B65",
          "green-dark": "#004F3A",
          red: "#F42A41",
          "red-light": "#FF4D63",
          "red-dark": "#C41F33",
          gold: "#F5C842",
          cream: "#FFF9F0",
          "dark-bg": "#0A1628",
          "dark-card": "#111F3A",
          "dark-border": "#1E3050",
        },
      },
      fontFamily: {
        display: ["'Hind Siliguri'", "sans-serif"],
        body: ["'Noto Sans Bengali'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "bd-gradient": "linear-gradient(135deg, #006A4E 0%, #004F3A 100%)",
        "bd-hero": "linear-gradient(135deg, #006A4E 0%, #008B65 50%, #F42A41 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(0,106,78,0.15) 0%, rgba(244,42,65,0.05) 100%)",
      },
      animation: {
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        "pulse-green": "pulseGreen 2s infinite",
        "bounce-light": "bounceLight 1s infinite",
        "shimmer": "shimmer 1.5s infinite",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGreen: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,106,78,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(0,106,78,0)" },
        },
        bounceLight: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
