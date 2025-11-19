import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Tailwind is loaded via postcss.config.cjs; no need to import here

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
    server: {
        proxy: {
            '/api': {
                target: 'https://fapi.binance.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => {
                    const newPath = path.replace(/^\/api/, '/fapi/v1')
                    console.log('[Proxy] Rewrite:', path, '->', newPath)
                    return newPath
                },
            },
        },
    },
})