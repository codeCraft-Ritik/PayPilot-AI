/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F7F7F4',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#EFEFEA',
          muted: '#E6E7E0',
        },
        foreground: {
          DEFAULT: '#171916',
          muted: '#747770',
          subtle: '#9A9D96',
        },
        border: {
          DEFAULT: '#DCDDD5',
          subtle: '#EBECE6',
          strong: '#B4B6AC',
        },
        accent: {
          DEFAULT: '#315BFF',
          hover: '#2448D8',
          subtle: '#EDF1FF',
          border: '#C0D0FF',
        },
        success: {
          DEFAULT: '#16794B',
          subtle: '#EAF6EF',
          border: '#B1E3C8',
        },
        warning: {
          DEFAULT: '#A66A12',
          subtle: '#FEF6E7',
          border: '#F6DA9C',
        },
        danger: {
          DEFAULT: '#B42318',
          subtle: '#FEF3F2',
          border: '#FECDCA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        tactile: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'tactile-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'tactile-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.03)',
        brutal: '2px 2px 0px 0px #171916',
        'brutal-accent': '2px 2px 0px 0px #315BFF',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
};
