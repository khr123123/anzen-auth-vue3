import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

const baseUrl = 'http://localhost:8080';
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
    extensions: ['.js', '.ts', '.vue', '.json'],
  },
  server: {
    port: 80,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: baseUrl,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, '')
      },
      '^/v3/api-docs/(.*)': {
        target: baseUrl,
        changeOrigin: true,
      }
    }
  },
});
