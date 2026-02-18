import Inspect from 'vite-plugin-inspect';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { defineConfig } from 'vite';


export default defineConfig({
  build: {
    inject: true
  },
  plugins: [
    Inspect(),
    ViteImageOptimizer({
      dir: 'weather-widget/img',
      outDir: 'dist/img',
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        lossless: true,
      },
    }),
  ],
});