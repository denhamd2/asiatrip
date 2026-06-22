import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const tripadvisorKey = env.VITE_TRIPADVISOR_API_KEY

  return {
    plugins: [react(), tailwindcss()],
    server: tripadvisorKey
      ? {
          proxy: {
            '/api/tripadvisor': {
              target: 'https://api.content.tripadvisor.com/api/v1',
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api\/tripadvisor/, ''),
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq, req) => {
                  const url = new URL(req.url ?? '', 'http://localhost')
                  if (!url.searchParams.has('key')) {
                    url.searchParams.set('key', tripadvisorKey)
                    proxyReq.path = `${url.pathname}?${url.searchParams.toString()}`
                  }
                })
              },
            },
          },
        }
      : undefined,
  }
})
