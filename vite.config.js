import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/replicate': {
        target: 'https://api.replicate.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/replicate/, ''),
        secure: true,
      },
      '/together': {
        target: 'https://api.together.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/together/, ''),
        secure: true,
      }
    }
  }
})