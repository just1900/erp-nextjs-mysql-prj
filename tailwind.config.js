/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "oklch(0.45 0.2 260)",
          foreground: "oklch(0.98 0.01 247.88)",
        },
        background: "oklch(0.98 0.01 247.88)",
        foreground: "oklch(0.2 0.02 247.88)",
        card: {
          DEFAULT: "oklch(1 0 0)",
          foreground: "oklch(0.2 0.02 247.88)",
        },
        popover: {
          DEFAULT: "oklch(1 0 0)",
          foreground: "oklch(0.2 0.02 247.88)",
        },
        secondary: {
          DEFAULT: "oklch(0.96 0.01 247.88)",
          foreground: "oklch(0.2 0.02 247.88)",
        },
        muted: {
          DEFAULT: "oklch(0.96 0.01 247.88)",
          foreground: "oklch(0.55 0.02 247.88)",
        },
        accent: {
          DEFAULT: "oklch(0.96 0.01 247.88)",
          foreground: "oklch(0.2 0.02 247.88)",
        },
        destructive: {
          DEFAULT: "oklch(0.5 0.2 25)",
          foreground: "oklch(0.98 0.01 247.88)",
        },
        border: "oklch(0.9 0.01 247.88)",
        input: "oklch(0.9 0.01 247.88)",
        ring: "oklch(0.45 0.2 260)",
      },
      borderRadius: {
        lg: "1rem",
        md: "calc(1rem - 2px)",
        sm: "calc(1rem - 4px)",
      },
    },
  },
  plugins: [],
};
