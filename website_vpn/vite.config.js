import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/info': {
        target: 'http://jordansissilian.fr:8082',
        changeOrigin: true,
        secure: false,
      },
      '/:id/status': {
        target: 'http://jordansissilian.fr:8082',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/(\d+)\/status/, '/$1/status'),
      },
    },
  },
})
