import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
