import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/assets',
          dest: '' // copies to dist/assets
        }
      ]
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  // Ensure assets are handled correctly
  base: './',
  build: {
    // Ensure compatibility with Electron
    target: 'esnext',
  },
  // Fix for some Node.js modules in renderer
  optimizeDeps: {
    exclude: []
  }
})
