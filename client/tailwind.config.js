const c = (v) => `rgb(var(${v}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"] },
      colors: {
        surface: { DEFAULT: c("--surface"), card: c("--card"), raised: c("--raised"), border: c("--border") },
        brand: { DEFAULT: c("--brand"), hover: c("--brand-hover") },
        accent: c("--accent"),
        muted: c("--muted"),
        ink: c("--ink"),
      },
    },
  },
  plugins: [],
};