import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT for GitHub Pages: set base to repo name
  // Replace 'PWEB' if your repository name differs
  base: '/PWEB/',
  build: {
    // Emit static files to docs/ for "Deploy from a branch"
    outDir: 'docs',
  },
})
