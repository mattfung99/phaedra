/// <reference types="vite-react-ssg" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// GitHub Pages serves the project site under /<repo>/. `base` MUST match the repo
// name so built asset URLs resolve. A custom domain later would set base to '/'.
// https://vite.dev/config/
export default defineConfig({
  base: '/phaedra/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // vite-react-ssg: 'nested' emits /blog/slug/index.html for clean, crawlable URLs.
  ssgOptions: {
    dirStyle: 'nested',
  },
})
