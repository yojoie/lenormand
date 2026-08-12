import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    sourcemap: false,
    emptyOutDir: true,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js is huge (~600KB), only needed by ASCIIText
          three: ['three'],
          // GSAP used by DecayCard and Shuffle
          gsap: ['gsap'],
          // Framer Motion used across pages
          'framer-motion': ['framer-motion'],
          // OGL WebGL library used by SpecularButton, WarpText (sub-pages only)
          ogl: ['ogl'],
          // React core
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
  },
  plugins: [
    react({
      babel: {
        plugins: ['react-dev-locator'],
      },
    }),
    // Note: gzip compression is handled automatically by Cloudflare's edge network
  ],
})
