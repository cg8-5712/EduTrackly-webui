/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Aptos"',
          '"Segoe UI Variable Display"',
          '"Microsoft YaHei UI"',
          '"PingFang SC"',
          "sans-serif",
        ],
        display: [
          '"Aptos Display"',
          '"Segoe UI Variable Display"',
          '"Microsoft YaHei UI"',
          '"PingFang SC"',
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          '"Cascadia Code"',
          '"Consolas"',
          "monospace",
        ],
      },
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.25rem" }],
        sm: ["1rem", { lineHeight: "1.5rem" }],
        base: ["1.125rem", { lineHeight: "1.75rem" }],
        lg: ["1.25rem", { lineHeight: "1.85rem" }],
        xl: ["1.375rem", { lineHeight: "1.95rem" }],
        "2xl": ["1.625rem", { lineHeight: "2.15rem" }],
        "3xl": ["2rem", { lineHeight: "2.5rem" }],
        "4xl": ["2.5rem", { lineHeight: "2.9rem" }],
        "5xl": ["3.25rem", { lineHeight: "1" }],
        "6xl": ["4rem", { lineHeight: "1" }],
        "7xl": ["4.8rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["7.5rem", { lineHeight: "1" }],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        panel: {
          soft: "var(--panel-soft)",
          strong: "var(--panel-strong)",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 0.5rem)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.3rem)",
        sm: "calc(var(--radius) - 0.6rem)",
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
        glow: "var(--shadow-glow)",
        inset: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      },
      backgroundImage: {
        "board-radial":
          "radial-gradient(circle at top, rgba(var(--primary-rgb), 0.15), transparent 48%), radial-gradient(circle at bottom right, rgba(var(--secondary-rgb), 0.12), transparent 36%)",
        "board-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      animation: {
        "soft-pulse": "softPulse 4s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        "fade-up": "fadeUp 0.45s ease-out",
      },
      keyframes: {
        softPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.92", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
