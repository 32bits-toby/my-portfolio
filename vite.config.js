import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        ai: resolve(__dirname, 'ai.html'),
        project: resolve(__dirname, 'project.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
});
