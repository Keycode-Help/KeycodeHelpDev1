import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {},
    postcss: true
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    },
  },
});