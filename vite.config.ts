import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.svg'],
      manifest: {
        name: 'Your App Name',
        short_name: 'App',
        description: 'Your app description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      devOptions: {
        enabled: true
      }
    }) as any
  ],
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'svg-to-pwa-icons',
          async writeBundle() {
            const sizes = [192, 512]
            
            for (const size of sizes) {
              await sharp(resolve(__dirname, 'public/logo.svg'))
                .resize(size, size)
                .toFile(resolve(__dirname, `public/pwa-${size}x${size}.png`))
            }
          }
        }
      ]
    }
  }
})
