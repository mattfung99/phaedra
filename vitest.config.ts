import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // supabase/functions are Deno tests (jsr:/npm: imports) — run separately.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**', 'supabase/**'],
    // Dummy Supabase env so `@/lib/supabase` can construct its client in tests.
    env: {
      VITE_SUPABASE_URL: 'http://localhost:54321',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    },
  },
})
