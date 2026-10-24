import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('src/data/questions/')) {
            const match = id.match(/src\/data\/questions\/([^/]+)/);
            if (match) return `questions-${match[1]}`;
          }
        },
      },
    },
  },
})
