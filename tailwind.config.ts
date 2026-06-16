import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        improx: {
          bg: "#050816",
          card: "#0B1024",
          cyan: "#19E6FF",
          violet: "#7C3AED",
          gold: "#FFCB45"
        }
      }
    }
  },
  plugins: []
};
export default config;
