import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
      '@components': path.resolve(process.cwd(), 'src/components'),
      '@context': path.resolve(process.cwd(), 'src/context'),
      '@utils': path.resolve(process.cwd(), 'src/utils'),
      '@hooks': path.resolve(process.cwd(), 'src/hooks'),
      '@lib': path.resolve(process.cwd(), 'src/lib'),
      '@data': path.resolve(process.cwd(), 'src/data'),
      '@mock': path.resolve(process.cwd(), 'src/mock'),
      '@services': path.resolve(process.cwd(), 'src/services'),
    },
  },
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 5173
  }
});