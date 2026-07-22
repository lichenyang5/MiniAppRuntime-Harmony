import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2017',
    outDir: 'dist',
    emptyOutDir: true
  }
});
