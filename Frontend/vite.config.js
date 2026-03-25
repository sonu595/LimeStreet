import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: env.VITE_DEV_HOST || '0.0.0.0',
      port: Number(env.VITE_DEV_PORT || 5173),
      strictPort: true
    },
    preview: {
      host: env.VITE_DEV_HOST || '0.0.0.0',
      port: Number(env.VITE_PREVIEW_PORT || env.VITE_DEV_PORT || 4173)
    }
  }
})
