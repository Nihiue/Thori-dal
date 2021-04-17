import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteCompression({
    algorithm: 'brotliCompress',
    ext: '.br'
  })],
  base: '',
  server: {
    port: '8000',
    proxy: {
      '^/api/': {
        target: 'https://www.foo.bar',
        changeOrigin: true
      }
    }
  }
})
