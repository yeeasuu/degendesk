import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        void: '#050712',
        ink: '#0a1020',
        acid: '#7CFF6B',
        cyan: '#63E6FF',
        violet: '#B784FF',
      },
      boxShadow: {
        neon: '0 0 50px rgba(99, 230, 255, 0.18)',
        acid: '0 0 40px rgba(124, 255, 107, 0.18)',
      },
      backgroundImage: {
        'grid-glow': 'radial-gradient(circle at 20% 20%, rgba(124,255,107,.18), transparent 28%), radial-gradient(circle at 80% 0%, rgba(183,132,255,.18), transparent 30%), radial-gradient(circle at 60% 80%, rgba(99,230,255,.12), transparent 35%)',
      },
    },
  },
  plugins: [],
};

export default config;
