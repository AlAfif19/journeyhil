import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "Outfit", "system-ui", "sans-serif"],
        body: ["Outfit", "Poppins", "system-ui", "sans-serif"],
        pixel: ["Pixelify Sans", "\"Press Start 2P\"", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
