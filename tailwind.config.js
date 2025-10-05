// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        'static-white': '#FFFFFF',
        'jassas-header-bg': '#f7f7f7',
        'jassas-header-border': '#e5e5e5',
        'jassas-footer-bg': '#222222',
        'jassas-accent-red': '#d81f26',
        'jassas-text-dark': '#333333',
        'jassas-text-light': '#ffffff',
        'jassas-text-muted': '#a1a1a1',
        border: "var(--color-border)",
        background: "var(--color-background)",
        "background-secondary": "var(--color-background-secondary)",
        foreground: "var(--color-text-primary)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        accent: "var(--color-accent)",
        "accent-text": "var(--color-accent-text)",
      },
      fontFamily: {
        "almarai-regular": ["var(--font-almarai-regular)", "system-ui"],
        "almarai-bold": ["var(--font-almarai-bold)", "system-ui"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "scroll": {
          "to": {
            transform: "translateX(-50%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // زدنا المدة لتناسب عدد الصور الكبير
        "scroll": "scroll 80s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};