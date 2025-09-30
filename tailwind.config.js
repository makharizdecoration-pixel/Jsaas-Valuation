/** @type {import('tailwindcss').Config} */

// دالة تُمكّن ألوان المتغيّرات من استخدام /opacity مثل border-accent/20
const withAlpha = (cssVar) => {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `var(${cssVar})`;
    }
    // خلط اللون مع الشفافية (مدعوم في المتصفحات الحديثة)
    const percent = Math.round(parseFloat(opacityValue) * 100);
    return `color-mix(in srgb, var(${cssVar}) ${percent}%, transparent)`;
  };
};

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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
