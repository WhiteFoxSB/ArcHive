import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
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
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: [
                // prevent electron built-ins from being bundled
                'electron',
                'fs',
                'path',
                'url',
              ],
            },
          },
        },
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          options.reload();
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron'],
              output: {
                entryFileNames: 'preload.js',
                format: 'cjs', // CommonJS format for sandbox compatibility
              },
            },
          },
        },
      },
    ]),
    renderer(),
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
    rollupOptions: {
      external: ['electron']
    }
  },
  // Fix for some Node.js modules in renderer
  optimizeDeps: {
    exclude: ['electron']
  }
})
