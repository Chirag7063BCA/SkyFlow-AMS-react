import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Only used now for test: expose Vite dev server on local Wi-Fi / hotspot for mobile QR scanning
  server: {
    host: true,
  },
})
