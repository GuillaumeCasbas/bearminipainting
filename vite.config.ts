import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { copyFileSync } from 'fs';
import tailwindcss from '@tailwindcss/vite';

function spaFallback(): Plugin {
  const name = 'spa-404-fallback';
  return {
    name,
    apply: 'build',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html');
    },
  };
}

export default defineConfig({
  base: '/bearminipainting/',
  plugins: [
    react(),
    tailwindcss(),
    spaFallback()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
