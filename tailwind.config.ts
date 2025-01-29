import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        heartbeat: 'heartbeat 1.0s ease-in-out infinite',
        smallbeat: "smallbeat 1.0s ease-in-out infinite",
        tilt: "tilt 0.3s ease-in-out forwards",
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        smallbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" }, // Smaller beat effect
        },
        tilt: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(2deg)" }, // Final tilt position
        },
      },
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
